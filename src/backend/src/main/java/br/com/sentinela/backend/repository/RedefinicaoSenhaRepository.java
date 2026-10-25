package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.RedefinicaoSenha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RedefinicaoSenhaRepository extends JpaRepository<RedefinicaoSenha, Long> {
    Optional<RedefinicaoSenha> findByTokenHash(String tokenHash);
    List<RedefinicaoSenha> findByUsuarioIdAndUsadoEmIsNull(Long usuarioId);
    Optional<RedefinicaoSenha> findFirstByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);
}
