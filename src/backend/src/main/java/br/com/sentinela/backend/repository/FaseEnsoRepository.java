package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.FaseEnso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaseEnsoRepository extends JpaRepository<FaseEnso, Long> {

    Optional<FaseEnso> findByAnoAndMes(Integer ano, Integer mes);

    Optional<FaseEnso> findFirstByOrderByAnoDescMesDesc();

    List<FaseEnso> findAllByOrderByAnoDescMesDesc();
}