package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Recomendacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecomendacaoRepository extends JpaRepository<Recomendacao, Long> {
    Optional<Recomendacao> findFirstByCulturaIdAndTipoAlerta(Long culturaId, String tipoAlerta);
    Optional<Recomendacao> findFirstByCulturaIsNullAndTipoAlerta(String tipoAlerta);
}
