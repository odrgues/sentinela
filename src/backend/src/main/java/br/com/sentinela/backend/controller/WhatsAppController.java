package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.MensagemRepository;
import br.com.sentinela.backend.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {

    public record MensagemDTO(Long id, String chatId, String direcao, String conteudo, String intencao,
                              LocalDateTime registradoEm) {}

    private final MensagemRepository mensagemRepository;
    private final WhatsAppService whatsAppService;

    @GetMapping("/historico")
    public ResponseEntity<List<MensagemDTO>> listarHistoricoDoUsuario(@AuthenticationPrincipal Usuario usuario) {
        List<MensagemDTO> historico = mensagemRepository.findByUsuarioIdOrderByRegistradoEmDesc(usuario.getId())
                .stream()
                .map(m -> new MensagemDTO(m.getId(), m.getChatId(), m.getDirecao(), m.getConteudo(),
                        m.getIntencao(), m.getRegistradoEm()))
                .toList();
        return ResponseEntity.ok(historico);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> receberWebhookWhatsApp(@RequestBody Map<String, Object> payload,
                                                       @AuthenticationPrincipal Usuario usuario) {
        String texto = payload.getOrDefault("texto", "").toString();
        String chatId = payload.getOrDefault("chat_id", usuario.getWhatsappNumero()).toString();
        String intencao = payload.getOrDefault("intencao", "nao_identificada").toString();

        whatsAppService.registrarMensagemRecebida(usuario, chatId, texto, intencao);
        return ResponseEntity.ok().build();
    }
}