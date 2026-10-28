package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByWhatsappNumero(String whatsappNumero);
    Optional<Usuario> findByWhatsappNumero(String whatsappNumero);
    Optional<Usuario> findByWhatsappLid(String whatsappLid);
    @Modifying
    @Transactional
    @Query(value = "UPDATE usuario SET whatsapp_lid = :lid WHERE id = :id AND (whatsapp_lid IS NULL OR whatsapp_lid = '')", nativeQuery = true)
    int atualizarWhatsappLidDireto(@Param("id") Long id, @Param("lid") String lid);
}
