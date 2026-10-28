package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.FaseCultura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaseCulturaRepository extends JpaRepository<FaseCultura, Long> {
    // A fase em que o dia do ciclo cai: diaInicio <= dia <= diaFim.
    Optional<FaseCultura> findFirstByCulturaIdAndDiaInicioLessThanEqualAndDiaFimGreaterThanEqual(
            Long culturaId, Integer dia, Integer mesmoDia);

    // Todas as fases, na ordem do ciclo.
    List<FaseCultura> findByCulturaIdOrderByDiaInicio(Long culturaId);
}
