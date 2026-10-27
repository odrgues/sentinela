package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    List<Mensagem> findByUsuarioIdOrderByRegistradoEmDesc(Long usuarioId);

    List<Mensagem> findByChatIdOrderByRegistradoEmDesc(String chatId);

    List<Mensagem> findAllByOrderByRegistradoEmDesc();
}