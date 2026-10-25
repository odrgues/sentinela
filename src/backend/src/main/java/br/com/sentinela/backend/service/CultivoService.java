package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.CultivoRequestDTO;
import br.com.sentinela.backend.dto.CultivoResponseDTO;
import br.com.sentinela.backend.dto.DetalheCultivoDTO;
import br.com.sentinela.backend.dto.DiaPrevistoDTO;
import br.com.sentinela.backend.dto.EditarCultivoDTO;
import br.com.sentinela.backend.dto.HistoricoDTO;
import br.com.sentinela.backend.exception.BusinessRuleException;
import br.com.sentinela.backend.exception.RecursoConflitoException;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.model.Municipio;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.AlertaRepository;
import br.com.sentinela.backend.repository.CultivoRepository;
import br.com.sentinela.backend.repository.CulturaRepository;
import br.com.sentinela.backend.repository.MunicipioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CultivoService {

    private static final int TAMANHO_DA_PAGINA = 20;

    private final CultivoRepository cultivoRepository;
    private final CulturaRepository culturaRepository;
    private final MunicipioRepository municipioRepository;
    private final AlertaRepository alertaRepository;
    private final AgendadorAlertasService rotina;
    private final PrevisaoService previsaoService;
    private final AvisosService avisosService;
    private final OrientacaoService orientacaoService;
    private final FaseEnsoService faseEnsoService;

    @Transactional(readOnly = true)
    public List<CultivoResponseDTO> listarPorUsuario(Usuario usuario) {
        return cultivoRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(CultivoResponseDTO::new)
                .toList();
    }

    // Salva e já busca a previsão e gera os avisos, para o painel não abrir vazio.
    public CultivoResponseDTO cadastrar(CultivoRequestDTO dto, Usuario usuario) {
        String apelido = dto.apelido().trim();
        if (cultivoRepository.existsByUsuarioIdAndApelidoIgnoreCase(usuario.getId(), apelido)) {
            throw new RecursoConflitoException("Você já tem uma lavoura com esse nome.", "apelido");
        }
        Cultura cultura = buscarCultura(dto.culturaId());

        Cultivo cultivo = new Cultivo();
        cultivo.setUsuario(usuario);
        cultivo.setCultura(cultura);
        cultivo.setApelido(apelido);
        cultivo.setAreaHa(dto.areaHa());
        cultivo.setLatitude(dto.latitude());
        cultivo.setLongitude(dto.longitude());
        cultivo.setMunicipio(acharOuCriarMunicipio(dto.cidade(), dto.uf(), dto.latitude(), dto.longitude()));
        cultivo.setDataPlantio(dto.dataPlantio());
        cultivo.setDataColheitaPrevista(CicloDaCultura.colheitaPrevista(cultura, dto.dataPlantio(), Agora.hoje()));
        cultivo.setStatus("em_andamento");

        Cultivo salvo = cultivoRepository.save(cultivo);
        rotina.processarCultivo(salvo);
        return new CultivoResponseDTO(salvo);
    }

    // Manda só o que mudou. Mudar cultura, data ou lugar refaz a colheita prevista e os avisos.
    public CultivoResponseDTO editar(Long id, EditarCultivoDTO dto, Usuario usuario) {
        Cultivo cultivo = buscarDoUsuario(id, usuario);

        if (dto.getStatus() != null) {
            mudarStatus(cultivo, dto.getStatus());
        }

        if (dto.getApelido() != null) {
            String apelido = dto.getApelido().trim();
            if (!apelido.equalsIgnoreCase(cultivo.getApelido())
                    && cultivoRepository.existsByUsuarioIdAndApelidoIgnoreCase(usuario.getId(), apelido)) {
                throw new RecursoConflitoException("Você já tem uma lavoura com esse nome.", "apelido");
            }
            cultivo.setApelido(apelido);
        }

        if (dto.isAreaInformada()) {
            cultivo.setAreaHa(dto.getAreaHa());
        }

        boolean mudouCiclo = false;
        if (dto.getCulturaId() != null && !dto.getCulturaId().equals(cultivo.getCultura().getId())) {
            cultivo.setCultura(buscarCultura(dto.getCulturaId()));
            mudouCiclo = true;
        }
        if (dto.getDataPlantio() != null && !dto.getDataPlantio().equals(cultivo.getDataPlantio())) {
            cultivo.setDataPlantio(dto.getDataPlantio());
            mudouCiclo = true;
        }
        if (mudouCiclo) {
            cultivo.setDataColheitaPrevista(
                    CicloDaCultura.colheitaPrevista(cultivo.getCultura(), cultivo.getDataPlantio(), Agora.hoje()));
        }

        boolean mudouLugar = false;
        if (dto.getLatitude() != null && dto.getLongitude() != null
                && (!Objects.equals(dto.getLatitude(), cultivo.getLatitude())
                || !Objects.equals(dto.getLongitude(), cultivo.getLongitude()))) {
            cultivo.setLatitude(dto.getLatitude());
            cultivo.setLongitude(dto.getLongitude());
            if (dto.getCidade() != null && dto.getUf() != null) {
                cultivo.setMunicipio(acharOuCriarMunicipio(dto.getCidade(), dto.getUf(), dto.getLatitude(), dto.getLongitude()));
            }
            mudouLugar = true;
        }

        // O save faz merge e devolve outra instância; a resposta usa a que já tem cultura e município carregados.
        cultivoRepository.save(cultivo);
        if ("em_andamento".equals(cultivo.getStatus()) && (mudouCiclo || mudouLugar)) {
            rotina.processarCultivo(cultivo);
        }
        return new CultivoResponseDTO(cultivo);
    }

    // Os alertas e a previsão guardada saem junto (ON DELETE CASCADE).
    public void deletar(Long id, Usuario usuario) {
        cultivoRepository.delete(buscarDoUsuario(id, usuario));
    }

    @Transactional(readOnly = true)
    public DetalheCultivoDTO detalhe(Long id, Usuario usuario) {
        Cultivo cultivo = buscarDoUsuario(id, usuario);
        Cultura cultura = cultivo.getCultura();
        LocalDate hoje = Agora.hoje();

        Integer cicloDias = CicloDaCultura.cicloDias(cultura, cultivo.getDataPlantio(), cultivo.getDataColheitaPrevista());
        Integer diaAtual = CicloDaCultura.diaAtual(cultura, cultivo.getDataPlantio(), cultivo.getDataColheitaPrevista(), hoje);

        List<DetalheCultivoDTO.AlertaDaSemanaDTO> alertas = avisosService.daSemana(cultivo).stream()
                .map(alerta -> new DetalheCultivoDTO.AlertaDaSemanaDTO(
                        alerta.getTipo(),
                        alerta.getSeveridade(),
                        alerta.getDataPrevista(),
                        alerta.getMensagem(),
                        Textos.porque(alerta.getTipo(), cultura),
                        orientacaoService.oQueFazer(cultura, alerta.getTipo())))
                .toList();

        List<DiaPrevistoDTO> semana = previsaoService.semana(cultivo.getId());
        boolean calorForte = ClassificadorDeAlertas.semanaDeCalorForte(cultura, semana);
        List<DetalheCultivoDTO.DiaDaPrevisaoDTO> previsao = semana.stream()
                .map(dia -> diaDaPrevisao(cultura, dia, calorForte))
                .toList();

        DetalheCultivoDTO.FaseDTO fase = orientacaoService.fase(cultura, diaAtual)
                .map(f -> new DetalheCultivoDTO.FaseDTO(f.getNome(), f.getDiaInicio(), f.getDiaFim(), f.getOrientacao(), f.getFonte()))
                .orElse(null);

        return new DetalheCultivoDTO(
                cultivo.getId(),
                cultivo.getApelido(),
                cultura.getNome(),
                cultura.getId(),
                cultivo.getAreaHa() == null ? null : cultivo.getAreaHa().doubleValue(),
                CultivoResponseDTO.nomeDoMunicipio(cultivo),
                cultivo.getLatitude(),
                cultivo.getLongitude(),
                cultivo.getStatus(),
                cultura.getTipoCiclo(),
                cultivo.getDataPlantio(),
                cultivo.getDataColheitaPrevista(),
                diaAtual,
                cicloDias,
                CicloDaCultura.safra(cultura, cultivo.getDataColheitaPrevista()),
                CicloDaCultura.explicacao(cultura),
                cultivo.getPrevisaoDisponivel(),
                Agora.comFuso(cultivo.getPrevisaoAtualizadaEm()),
                faseEnsoService.ensoDoCultivo(cultivo),
                fase,
                alertas,
                previsao
        );
    }

    @Transactional(readOnly = true)
    public HistoricoDTO historico(Long id, Usuario usuario, String severidade, String tipo,
                                  LocalDate de, LocalDate ate, int pagina) {
        Cultivo cultivo = buscarDoUsuario(id, usuario);
        Page<Alerta> resultado = alertaRepository.buscarHistorico(
                cultivo.getId(), vazioViraNulo(severidade), vazioViraNulo(tipo), de, ate,
                PageRequest.of(Math.max(pagina, 0), TAMANHO_DA_PAGINA));

        List<HistoricoDTO.AvisoDTO> itens = resultado.getContent().stream()
                .map(a -> new HistoricoDTO.AvisoDTO(a.getTipo(), a.getSeveridade(), a.getDataPrevista(), a.getMensagem()))
                .toList();
        return new HistoricoDTO(itens, resultado.getTotalElements(), Math.max(pagina, 0), TAMANHO_DA_PAGINA);
    }

    // Cultivo de outro usuário devolve 404, igual a inexistente, para não confirmar que o id existe.
    public Cultivo buscarDoUsuario(Long id, Usuario usuario) {
        return cultivoRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Lavoura não encontrada."));
    }

    private void mudarStatus(Cultivo cultivo, String novoStatus) {
        String status = novoStatus.toLowerCase();
        if (!List.of("colhido", "perdido").contains(status)) {
            throw new BusinessRuleException("Status inválido. Use colhido ou perdido.");
        }
        if (!"em_andamento".equals(cultivo.getStatus())) {
            throw new BusinessRuleException("Esta lavoura já foi encerrada.");
        }
        cultivo.setStatus(status);
    }

    private Cultura buscarCultura(Long culturaId) {
        return culturaRepository.findById(culturaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cultura não encontrada."));
    }

    // O município vem do ponto marcado no mapa. Se ainda não existe na tabela, nasce com esse ponto.
    private Municipio acharOuCriarMunicipio(String cidade, String uf, double latitude, double longitude) {
        String nome = cidade.trim();
        String sigla = uf.trim().toUpperCase();
        return municipioRepository.findByNomeIgnoreCaseAndUfIgnoreCase(nome, sigla)
                .orElseGet(() -> {
                    Municipio novo = new Municipio();
                    novo.setNome(nome);
                    novo.setUf(sigla);
                    novo.setLatitude(latitude);
                    novo.setLongitude(longitude);
                    return municipioRepository.save(novo);
                });
    }

    private static DetalheCultivoDTO.DiaDaPrevisaoDTO diaDaPrevisao(Cultura cultura, DiaPrevistoDTO dia,
                                                                    boolean semanaDeCalorForte) {
        ClassificadorDeAlertas.NivelDoDia nivel = ClassificadorDeAlertas.nivelDoDia(cultura, dia, semanaDeCalorForte);
        return new DetalheCultivoDTO.DiaDaPrevisaoDTO(
                dia.data(),
                Textos.condicao(dia.codigoTempo()),
                Math.round(dia.tempMinC()),
                Math.round(dia.tempMaxC()),
                dia.chuvaMm(),
                nivel.nivel(),
                nivel.frase()
        );
    }

    private static String vazioViraNulo(String texto) {
        return texto == null || texto.isBlank() ? null : texto;
    }
}
