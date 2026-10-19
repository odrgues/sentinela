package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Cultura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CulturaRepository extends JpaRepository<Cultura, Long> {

    List<Cultura> findAllByOrderByNomeAsc();

    boolean existsByNome(String nome);
}