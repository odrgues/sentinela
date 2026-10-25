package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.model.FaseCultura;
import br.com.sentinela.backend.model.Recomendacao;
import br.com.sentinela.backend.repository.FaseCulturaRepository;
import br.com.sentinela.backend.repository.RecomendacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

// O "O que fazer" de cada aviso e a fase do ciclo. São textos do banco, cada um com a sua fonte:
// o código só escolhe qual mostrar.
@Service
@RequiredArgsConstructor
public class OrientacaoService {

    private final RecomendacaoRepository recomendacaoRepository;
    private final FaseCulturaRepository faseCulturaRepository;

    // Primeiro a recomendação da cultura; se não houver, a genérica do tipo; se não houver, nulo.
    public String oQueFazer(Cultura cultura, String tipoAlerta) {
        return recomendacaoRepository.findFirstByCulturaIdAndTipoAlerta(cultura.getId(), tipoAlerta)
                .or(() -> recomendacaoRepository.findFirstByCulturaIsNullAndTipoAlerta(tipoAlerta))
                .map(Recomendacao::getTexto)
                .orElse(null);
    }

    public Optional<FaseCultura> fase(Cultura cultura, Integer diaAtual) {
        if (diaAtual == null) return Optional.empty();
        return faseCulturaRepository
                .findFirstByCulturaIdAndDiaInicioLessThanEqualAndDiaFimGreaterThanEqual(cultura.getId(), diaAtual, diaAtual);
    }
}
