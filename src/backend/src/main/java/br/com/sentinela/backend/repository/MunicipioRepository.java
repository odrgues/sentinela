package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MunicipioRepository extends JpaRepository<Municipio, Long> {
    Optional<Municipio> findByNomeIgnoreCaseAndUfIgnoreCase(String nome, String uf);
}
