package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.CulturaDetalheResponseDTO;
import br.com.sentinela.backend.dto.CulturaListaResponseDTO;
import br.com.sentinela.backend.dto.CulturaRequestDTO;
import br.com.sentinela.backend.exception.AcessoNegadoException;
import br.com.sentinela.backend.exception.BusinessRuleException;
import br.com.sentinela.backend.exception.RecursoConflitoException;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.CulturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CulturaService {

    private final CulturaRepository culturaRepository;

    @Transactional(readOnly = true)
    public List<CulturaListaResponseDTO> listarTodas() {
        return culturaRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(CulturaListaResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CulturaDetalheResponseDTO obterPorId(Long id) {
        Cultura cultura = buscarPorId(id);
        return new CulturaDetalheResponseDTO(cultura);
    }

    // Só o admin cadastra e altera culturas; é o único 403 da API.
    public void exigirAdmin(Usuario usuario) {
        if (!"admin".equals(usuario.getPapel())) {
            throw new AcessoNegadoException("Só o administrador pode cadastrar ou alterar culturas.");
        }
    }

    @Transactional
    public CulturaDetalheResponseDTO cadastrar(CulturaRequestDTO dto) {
        if (culturaRepository.existsByNome(dto.nome())) {
            throw new RecursoConflitoException("Já existe uma cultura cadastrada com o nome: " + dto.nome());
        }

        validarFaixasEValores(dto);

        Cultura cultura = new Cultura();
        copiarDtoParaEntidade(dto, cultura);

        Cultura salva = culturaRepository.save(cultura);
        return new CulturaDetalheResponseDTO(salva);
    }

    @Transactional
    public CulturaDetalheResponseDTO atualizar(Long id, CulturaRequestDTO dto) {
        Cultura cultura = buscarPorId(id);

        if (dto.nome() != null && !cultura.getNome().equalsIgnoreCase(dto.nome())
                && culturaRepository.existsByNome(dto.nome())) {
            throw new RecursoConflitoException("Já existe uma cultura cadastrada com o nome: " + dto.nome());
        }

        validarFaixasEValores(dto);
        copiarDtoParaEntidade(dto, cultura);

        Cultura atualizada = culturaRepository.save(cultura);
        return new CulturaDetalheResponseDTO(atualizada);
    }

    private Cultura buscarPorId(Long id) {
        return culturaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cultura não encontrada com o ID: " + id));
    }

    private void validarFaixasEValores(CulturaRequestDTO dto) {
        if (dto.tipoCiclo() != null && !List.of("anual", "cana", "perene", "continua").contains(dto.tipoCiclo())) {
            throw new BusinessRuleException("Tipo de ciclo inválido. Use anual, cana, perene ou continua.");
        }
        if ("continua".equals(dto.tipoCiclo()) && (dto.inicioColheitaDias() == null || dto.cicloDias() == null
                || dto.inicioColheitaDias() < 1 || dto.inicioColheitaDias() > dto.cicloDias())) {
            throw new BusinessRuleException("Na colheita contínua, informe em que dia a colheita começa (entre 1 e o ciclo).");
        }
        if (dto.tempMinIdealC() != null && dto.tempMaxIdealC() != null && dto.tempMinIdealC() >= dto.tempMaxIdealC()) {
            throw new BusinessRuleException("A temperatura mínima ideal deve ser menor que a máxima ideal.");
        }
        if (dto.tempCriticaBaixaC() != null && dto.tempMinIdealC() != null && dto.tempCriticaBaixaC() > dto.tempMinIdealC()) {
            throw new BusinessRuleException("A temperatura crítica baixa deve ser menor ou igual à mínima ideal.");
        }
        if (dto.tempCriticaAltaC() != null && dto.tempMaxIdealC() != null && dto.tempCriticaAltaC() < dto.tempMaxIdealC()) {
            throw new BusinessRuleException("A temperatura crítica alta deve ser maior ou igual à máxima ideal.");
        }
        if (dto.chuvaSemMinMm() != null && dto.chuvaSemMaxMm() != null && dto.chuvaSemMinMm() >= dto.chuvaSemMaxMm()) {
            throw new BusinessRuleException("A chuva semanal mínima deve ser menor que a máxima.");
        }
    }

    private void copiarDtoParaEntidade(CulturaRequestDTO dto, Cultura cultura) {
        if (dto.nome() != null) cultura.setNome(dto.nome());
        if (dto.tipoCiclo() != null) cultura.setTipoCiclo(dto.tipoCiclo());
        if (dto.cicloDias() != null) cultura.setCicloDias(dto.cicloDias());
        if (dto.inicioColheitaDias() != null) cultura.setInicioColheitaDias(dto.inicioColheitaDias());
        if (dto.mesInicioColheita() != null) cultura.setMesInicioColheita(dto.mesInicioColheita());
        if (dto.mesFimColheita() != null) cultura.setMesFimColheita(dto.mesFimColheita());
        if (dto.tempMinIdealC() != null) cultura.setTempMinIdealC(dto.tempMinIdealC());
        if (dto.tempMaxIdealC() != null) cultura.setTempMaxIdealC(dto.tempMaxIdealC());
        if (dto.tempCriticaBaixaC() != null) cultura.setTempCriticaBaixaC(dto.tempCriticaBaixaC());
        if (dto.tempCriticaAltaC() != null) cultura.setTempCriticaAltaC(dto.tempCriticaAltaC());
        if (dto.chuvaSemMinMm() != null) cultura.setChuvaSemMinMm(dto.chuvaSemMinMm());
        if (dto.chuvaSemMaxMm() != null) cultura.setChuvaSemMaxMm(dto.chuvaSemMaxMm());
        if (dto.fonte() != null) cultura.setFonte(dto.fonte());
        if (dto.observacao() != null) cultura.setObservacao(dto.observacao());
    }
}