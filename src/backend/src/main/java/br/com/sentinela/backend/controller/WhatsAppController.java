package br.com.sentinela.backend.controller;

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

    private final MensagemRepository mensagemRepository;
    private final WhatsAppService whatsAppService;

    public record MensagemDTO(
            Long id,
            String chatId,
            String direcao,
            String conteudo,
            String intencao,
            LocalDateTime registradoEm
    ) {}

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
        try {
            log.debug("[WHATSAPP WEBHOOK] Payload recebido: {}", payload);

            JsonNode dataNode = payload.path("data");
            if (dataNode.isMissingNode() || dataNode.isNull()) {
                return ResponseEntity.ok().build();
            }

            JsonNode keyNode = dataNode.path("key");
            boolean fromMe = keyNode.path("fromMe").asBoolean(false);

            if (fromMe) {
                return ResponseEntity.ok().build();
            }

            String remoteJid = keyNode.path("remoteJid").asText("");
            if (remoteJid.isBlank()) {
                return ResponseEntity.ok().build();
            }

            if (remoteJid.contains("@g.us")) {
                return ResponseEntity.ok().build();
            }

            String chatId = remoteJid;
            String lid = remoteJid.contains("@lid") ? remoteJid : "";

            if (remoteJid.contains("@lid")) {
                log.info("[WHATSAPP WEBHOOK] Mensagem recebida com @lid: {}", remoteJid);
            }

            JsonNode messageNode = dataNode.path("message");
            String texto = "";

            if (messageNode.has("conversation")) {
                texto = messageNode.path("conversation").asText("");
            } else if (messageNode.has("extendedTextMessage")) {
                texto = messageNode.path("extendedTextMessage").path("text").asText("");
            }

            if (!texto.isBlank()) {
                WhatsAppService.RespostaWebhook resposta = whatsAppService.processarWebhook(chatId, lid, texto);

                // CORREÇÃO CRUCIAL: Se houver qualquer mensagem gerada, devolvemos ela no JSON
                // para o webhook responder instantaneamente no chat sem precisar de POST ativo (evita erro 400)
                if (resposta != null && resposta.mensagem() != null && !resposta.mensagem().isBlank()) {
                    return ResponseEntity.ok(Map.of("resposta", resposta.mensagem()));
                }
            }

        } catch (Exception e) {
            log.error("[WHATSAPP WEBHOOK] Erro ao processar webhook: {}", e.getMessage(), e);
        }

        return ResponseEntity.ok().build();
    }
}