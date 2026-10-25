package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.PrevisaoDiaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrevisaoDiariaRepository extends JpaRepository<PrevisaoDiaria, Long> {
    List<PrevisaoDiaria> findByCultivoIdAndDataBetweenOrderByDataAsc(Long cultivoId, LocalDate de, LocalDate ate);
    Optional<PrevisaoDiaria> findByCultivoIdAndData(Long cultivoId, LocalDate data);
}
