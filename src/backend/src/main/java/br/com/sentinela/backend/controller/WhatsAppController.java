package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.WhatsAppWebhookDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.MensagemRepository;
import br.com.sentinela.backend.service.WhatsAppService;
import com.fasterxml.jackson.databind.JsonNode;
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

    public record MensagemDTO(
            Long id,
            String chatId,
            String direcao,
            String conteudo,
            String intencao,
            LocalDateTime registradoEm
    ) {}

    private final MensagemRepository mensagemRepository;
    private final WhatsAppService whatsAppService;

    @GetMapping("/historico")
    public ResponseEntity<List<MensagemDTO>> listarHistoricoDoUsuario(
            @AuthenticationPrincipal Usuario usuario
    ) {
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        List<MensagemDTO> historico = mensagemRepository
                .findByUsuarioIdOrderByRegistradoEmDesc(usuario.getId())
                .stream()
                .map(m -> new MensagemDTO(
                        m.getId(),
                        m.getChatId(),
                        m.getDirecao(),
                        m.getConteudo(),
                        m.getIntencao(),
                        m.getRegistradoEm()
                ))
                .toList();

        return ResponseEntity.ok(historico);
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> receberWebhook(@RequestBody JsonNode payload) {
        // Ignora mensagens enviadas pelo próprio bot (fromMe = true)
        boolean fromMe = payload.path("data").path("key").path("fromMe").asBoolean(false);
        if (fromMe) {
            return ResponseEntity.ok().build();
        }

        // 1. Extrai o chatId REAL do remetente (remoteJid)
        String chatId = payload.path("data").path("key").path("remoteJid").asText();

        // 2. Extrai o texto da mensagem
        JsonNode messageNode = payload.path("data").path("message");
        String texto = "";

        if (messageNode.has("conversation")) {
            texto = messageNode.path("conversation").asText();
        } else if (messageNode.has("extendedTextMessage")) {
            texto = messageNode.path("extendedTextMessage").path("text").asText();
        }

        // 3. Valida campos mínimos
        if (chatId.isBlank() || texto.isBlank()) {
            return ResponseEntity.badRequest().body("{\"erro\": \"O chatId e o texto são obrigatórios.\"}");
        }

        // 4. Processa a mensagem passando o chatId real do remetente
        whatsAppService.processarEAtenderMensagem(chatId, texto, null);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/processar")
    public ResponseEntity<Map<String, String>> processarMensagemManual(@RequestBody WhatsAppWebhookDTO dto) {
        String resposta = whatsAppService.processarEAtenderMensagem(
                dto.chatId(),
                dto.texto(),
                dto.intencao()
        );

        return ResponseEntity.ok(Map.of(
                "resposta",
                resposta == null ? "" : resposta
        ));
    }
}