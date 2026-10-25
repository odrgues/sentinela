package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.OrientacaoEnso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrientacaoEnsoRepository extends JpaRepository<OrientacaoEnso, Long> {
    Optional<OrientacaoEnso> findFirstByFaseAndCulturaId(String fase, Long culturaId);
    Optional<OrientacaoEnso> findFirstByFaseAndCulturaIsNull(String fase);
}
