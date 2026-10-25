package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.PainelDTO;
import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.CultivoRepository;
import br.com.sentinela.backend.repository.PrevisaoDiariaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

// O painel lê do banco o que a rotina já calculou; nunca chama a Open-Meteo na hora.
@Service
@RequiredArgsConstructor
public class PainelService {

    private final CultivoRepository cultivoRepository;
    private final PrevisaoDiariaRepository previsaoDiariaRepository;
    private final AvisosService avisosService;
    private final OrientacaoService orientacaoService;

    private record LavouraComAviso(Cultivo cultivo, PainelDTO.Aviso aviso) {}

    @Transactional(readOnly = true)
    public PainelDTO painel(Usuario usuario) {
        List<LavouraComAviso> lavouras = lavourasDoMaisGraveParaOMaisLeve(usuario);

        PainelDTO.Hoje hoje = lavouras.isEmpty() ? null : tempoDeHoje(lavouras.get(0).cultivo());

        boolean previsaoDisponivel = lavouras.stream().allMatch(l -> l.cultivo().getPrevisaoDisponivel());
        LocalDateTime atualizadaEm = lavouras.stream()
                .map(l -> l.cultivo().getPrevisaoAtualizadaEm())
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null);

        List<PainelDTO.LavouraDoPainel> cultivos = lavouras.stream()
                .map(l -> paraOPainel(l.cultivo(), l.aviso()))
                .toList();

        return new PainelDTO(
                new PainelDTO.UsuarioDoPainel(usuario.getNome()),
                hoje,
                frase(lavouras),
                previsaoDisponivel,
                Agora.comFuso(atualizadaEm),
                cultivos
        );
    }

    // A frase da semana de todas as lavouras, também usada no resumo de segunda pelo WhatsApp.
    @Transactional(readOnly = true)
    public String fraseDaSemana(Usuario usuario) {
        return frase(lavourasDoMaisGraveParaOMaisLeve(usuario));
    }

    private List<LavouraComAviso> lavourasDoMaisGraveParaOMaisLeve(Usuario usuario) {
        return cultivoRepository.findByUsuarioIdAndStatus(usuario.getId(), "em_andamento").stream()
                .map(cultivo -> new LavouraComAviso(cultivo, avisoPrincipal(cultivo)))
                .sorted(Comparator
                        .comparing((LavouraComAviso l) -> -AvisosService.peso(l.aviso().severidade()))
                        .thenComparing(l -> l.cultivo().getId()))
                .toList();
    }

    // O aviso mais grave da semana. Sem aviso nenhum, "tudo certo" (ou "sem previsão", se nunca deu para buscar).
    private PainelDTO.Aviso avisoPrincipal(Cultivo cultivo) {
        LocalDate hoje = Agora.hoje();
        List<Alerta> avisos = avisosService.daSemana(cultivo);
        if (avisos.isEmpty()) {
            return cultivo.getPrevisaoAtualizadaEm() == null
                    ? new PainelDTO.Aviso("sem_previsao", "info", "Previsão ainda não disponível")
                    : new PainelDTO.Aviso("favoravel", "info", "Tudo certo esta semana");
        }
        Alerta principal = avisos.get(0);
        return new PainelDTO.Aviso(
                principal.getTipo(),
                principal.getSeveridade(),
                Textos.avisoCurto(principal.getTipo(), principal.getSeveridade(), principal.getDataPrevista(), hoje,
                        cultivo.getCultura())
        );
    }

    private PainelDTO.LavouraDoPainel paraOPainel(Cultivo cultivo, PainelDTO.Aviso aviso) {
        Cultura cultura = cultivo.getCultura();
        LocalDate hoje = Agora.hoje();
        Integer diaAtual = CicloDaCultura.diaAtual(cultura, cultivo.getDataPlantio(), cultivo.getDataColheitaPrevista(), hoje);
        String fase = orientacaoService.fase(cultura, diaAtual).map(f -> f.getNome()).orElse(null);

        return new PainelDTO.LavouraDoPainel(
                cultivo.getId(),
                cultivo.getApelido(),
                cultura.getNome(),
                cultura.getTipoCiclo(),
                diaAtual,
                CicloDaCultura.cicloDias(cultura, cultivo.getDataPlantio(), cultivo.getDataColheitaPrevista()),
                CicloDaCultura.safra(cultura, cultivo.getDataColheitaPrevista()),
                cultivo.getLatitude(),
                cultivo.getLongitude(),
                fase,
                aviso
        );
    }

    // O tempo de hoje na cidade da lavoura do topo da lista (a de aviso mais grave).
    private PainelDTO.Hoje tempoDeHoje(Cultivo cultivo) {
        return previsaoDiariaRepository.findByCultivoIdAndData(cultivo.getId(), Agora.hoje())
                .map(dia -> {
                    String condicao = Textos.condicao(dia.getCodigoTempo());
                    return new PainelDTO.Hoje(cultivo.getMunicipio().getNome(), cultivo.getMunicipio().getUf(),
                            Math.round(dia.getTempMaxC()), condicao, Textos.condicaoTexto(condicao));
                })
                .orElseGet(() -> new PainelDTO.Hoje(cultivo.getMunicipio().getNome(), cultivo.getMunicipio().getUf(),
                        null, "nublado", "previsão indisponível"));
    }

    // "Talhão do fundo: calor forte na quinta. Roça da baixada: pouca chuva na semana."
    private static String frase(List<LavouraComAviso> lavouras) {
        List<LavouraComAviso> comRisco = lavouras.stream()
                .filter(l -> !"info".equals(l.aviso().severidade()))
                .toList();
        if (lavouras.isEmpty()) return "Cadastre uma lavoura para ver a semana dela.";
        if (comRisco.isEmpty()) return "Semana tranquila: chuva e temperatura dentro do ideal nas suas lavouras.";
        return comRisco.stream()
                .map(l -> l.cultivo().getApelido() + ": " + minuscula(l.aviso().mensagem()) + ".")
                .collect(Collectors.joining(" "));
    }

    private static String minuscula(String texto) {
        return texto.isEmpty() ? texto : Character.toLowerCase(texto.charAt(0)) + texto.substring(1);
    }
}
