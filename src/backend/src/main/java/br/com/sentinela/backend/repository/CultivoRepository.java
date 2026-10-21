package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {

    List<Cultivo> findByUsuarioId(Long usuarioId);

    Optional<Cultivo> findByIdAndUsuarioId(Long id, Long usuarioId);
}