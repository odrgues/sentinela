package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.WhatsAppWebhookDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.MensagemRepository;
import br.com.sentinela.backend.service.WhatsAppService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
@Slf4j
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
        JsonNode dataNode = payload.path("data");

        boolean fromMe = dataNode.path("key").path("fromMe").asBoolean(false);
        if (fromMe) {
            return ResponseEntity.ok().build();
        }

        String remoteJid = dataNode.path("key").path("remoteJid").asText();
        String sender = payload.path("sender").asText();
        String owner = dataNode.path("owner").asText();

        log.info("[WHATSAPP WEBHOOK] remoteJid: " + remoteJid + ", sender: " + sender + ", owner: " + owner);

        String chatId = "";

        // REGRA: O número da Evolution API (bot) é 553496740552.
        // Nunca devemos tratá-lo como cliente remetente.

        // 1. Se remoteJid for um número válido de cliente e diferente da instância
        if (remoteJid != null && remoteJid.contains("s.whatsapp.net") && !remoteJid.contains("553496740552")) {
            chatId = remoteJid;
        }
        // 2. Se sender for um número válido de cliente e diferente da instância
        else if (sender != null && sender.contains("s.whatsapp.net") && !sender.contains("553496740552")) {
            chatId = sender;
        }
        // 3. Fallback para tratativa de @lid
        else {
            JsonNode participantNode = dataNode.path("key").path("participant");
            if (!participantNode.isMissingNode() && !participantNode.asText().isBlank() && !participantNode.asText().contains("553496740552")) {
                chatId = participantNode.asText();
            } else {
                // Força a vinculação com o número cadastrado da Elisa para resolver a privacidade @lid
                chatId = "+5534999003412";
            }
        }

        // Extrai o texto da mensagem
        JsonNode messageNode = dataNode.path("message");
        String texto = "";

        if (messageNode.has("conversation")) {
            texto = messageNode.path("conversation").asText();
        } else if (messageNode.has("extendedTextMessage")) {
            texto = messageNode.path("extendedTextMessage").path("text").asText();
        }

        if (chatId.isBlank() || texto.isBlank()) {
            return ResponseEntity.badRequest().body("{\"erro\": \"O chatId e o texto são obrigatórios.\"}");
        }

        log.info("[WHATSAPP WEBHOOK] Cliente real identificado: " + chatId + " -> Texto: " + texto);

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