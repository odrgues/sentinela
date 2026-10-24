package br.com.sentinela.backend.service;

import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.FaseEnso;
import br.com.sentinela.backend.repository.FaseEnsoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FaseEnsoService {

    private final FaseEnsoRepository faseEnsoRepository;

    public FaseEnso buscarFaseAtual() {
        LocalDate hoje = LocalDate.now();
        int anoAtual = hoje.getYear();
        int mesAtual = hoje.getMonthValue();

        return faseEnsoRepository.findByAnoAndMes(anoAtual, mesAtual)
                .orElseGet(() -> faseEnsoRepository.findFirstByOrderByAnoDescMesDesc()
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhum registro do fenômeno ENSO encontrado no banco.")));
    }

    public List<FaseEnso> listarHistorico() {
        return faseEnsoRepository.findAllByOrderByAnoDescMesDesc();
    }
}