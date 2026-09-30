package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByWhatsappNumero(String whatsappNumero);
    Optional<Usuario>findByWhatsappNumero(String whatsappNumero);

}
