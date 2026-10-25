package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Cultivo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Cultura, município e dono vêm junto: quase toda tela e a rotina das 6h usam os três.
@Repository
public interface CultivoRepository extends JpaRepository<Cultivo, Long> {

    @EntityGraph(attributePaths = {"cultura", "municipio", "usuario"})
    List<Cultivo> findByUsuarioId(Long usuarioId);

    @EntityGraph(attributePaths = {"cultura", "municipio", "usuario"})
    List<Cultivo> findByUsuarioIdAndStatus(Long usuarioId, String status);

    @EntityGraph(attributePaths = {"cultura", "municipio", "usuario"})
    Optional<Cultivo> findByIdAndUsuarioId(Long id, Long usuarioId);

    @EntityGraph(attributePaths = {"cultura", "municipio", "usuario"})
    List<Cultivo> findByStatus(String status);

    boolean existsByUsuarioIdAndApelidoIgnoreCase(Long usuarioId, String apelido);
}
