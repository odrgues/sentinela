package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    List<Mensagem> findByUsuarioIdOrderByRegistradoEmDesc(Long usuarioId);

    List<Mensagem> findByChatIdOrderByRegistradoEmDesc(String chatId);

    List<Mensagem> findAllByOrderByRegistradoEmDesc();

    // A última coisa que o bot disse a esta pessoa: mostra em que ponto da conversa ela está.
    Optional<Mensagem> findFirstByUsuarioIdAndDirecaoOrderByIdDesc(Long usuarioId, String direcao);

    // Para saber se a boas-vindas de um cadastro foi enviada há pouco.
    boolean existsByUsuarioIdAndDirecaoAndIntencaoAndRegistradoEmAfter(
            Long usuarioId, String direcao, String intencao, LocalDateTime desde);
}