package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.CultivoRequestDTO;
import br.com.sentinela.backend.dto.CultivoResponseDTO;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.model.Municipio;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.CultivoRepository;
import br.com.sentinela.backend.repository.CulturaRepository;
import br.com.sentinela.backend.repository.MunicipioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CultivoService {

    private final CultivoRepository cultivoRepository;
    private final CulturaRepository culturaRepository;
    private final MunicipioRepository municipioRepository;

    @Transactional(readOnly = true)
    public List<CultivoResponseDTO> listarPorUsuario(Usuario usuarioAutenticado) {
        return cultivoRepository.findByUsuarioId(usuarioAutenticado.getId())
                .stream()
                .map(CultivoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CultivoResponseDTO obterPorId(Long id, Usuario usuarioAutenticado) {
        Cultivo cultivo = buscarPorIdEUsuario(id, usuarioAutenticado.getId());
        return new CultivoResponseDTO(cultivo);
    }

    @Transactional
    public CultivoResponseDTO cadastrar(CultivoRequestDTO dto, Usuario usuarioAutenticado) {
        Municipio municipio = municipioRepository.findById(dto.municipioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Município não encontrado com ID: " + dto.municipioId()));

        Cultura cultura = culturaRepository.findById(dto.culturaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cultura não encontrada com ID: " + dto.culturaId()));

        Cultivo cultivo = new Cultivo();
        cultivo.setUsuario(usuarioAutenticado);
        cultivo.setMunicipio(municipio);
        cultivo.setCultura(cultura);
        cultivo.setApelido(dto.apelido());
        cultivo.setAreaHa(dto.areaHa());
        cultivo.setDataPlantio(dto.dataPlantio());
        cultivo.setDataColheitaPrevista(dto.dataColheitaPrevista());
        cultivo.setStatus("em_andamento");

        Cultivo salvo = cultivoRepository.save(cultivo);
        return new CultivoResponseDTO(salvo);
    }

    @Transactional
    public void deletar(Long id, Usuario usuarioAutenticado) {
        Cultivo cultivo = buscarPorIdEUsuario(id, usuarioAutenticado.getId());
        cultivoRepository.delete(cultivo);
    }

    private Cultivo buscarPorIdEUsuario(Long id, Long usuarioId) {
        return cultivoRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cultivo não encontrado ou não pertence ao usuário."));
    }

    @Transactional
    public CultivoResponseDTO atualizarStatus(Long cultivoId, Long usuarioId, String novoStatus) {
        Cultivo cultivo = cultivoRepository.findByIdAndUsuarioId(cultivoId, usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cultivo não encontrado com ID: " + cultivoId));

        String statusFormatado = novoStatus.toLowerCase();
        if (!List.of("em_andamento", "colhido", "perdido").contains(statusFormatado)) {
            throw new IllegalArgumentException("Status inválido. Use: em_andamento, colhido ou perdido.");
        }

        cultivo.setStatus(statusFormatado);
        Cultivo atualizado = cultivoRepository.save(cultivo);
        return new CultivoResponseDTO(atualizado);
    }
}