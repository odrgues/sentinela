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
    public ResponseEntity<Void> receberWebhook(@RequestBody JsonNode payload) {
        try {
            log.debug("[WHATSAPP WEBHOOK] Payload recebido: {}", payload);

            JsonNode dataNode = payload.path("data");
            if (dataNode.isMissingNode() || dataNode.isNull()) {
                return ResponseEntity.ok().build();
            }

            JsonNode keyNode = dataNode.path("key");
            boolean fromMe = keyNode.path("fromMe").asBoolean(false);

            // Ignora mensagens enviadas pelo próprio bot
            if (fromMe) {
                return ResponseEntity.ok().build();
            }

            String remoteJid = keyNode.path("remoteJid").asText("");
            String chatId;
            String lid = "";

            if (remoteJid.contains("@s.whatsapp.net")) {
                chatId = remoteJid.replace("@s.whatsapp.net", "");
            } else if (remoteJid.contains("@g.us")) {
                return ResponseEntity.ok().build(); // Ignora grupos
            } else {
                log.info("[WHATSAPP WEBHOOK] Payload completo recebido com @lid: {}", dataNode.toString());

                // Preserva o LID para que o service possa vincular ao usuário
                lid = remoteJid.contains("@lid") ? remoteJid : "";

                // Tenta extrair o número de telefone de todas as chaves possíveis enviadas pela Evolution API
                String numero = keyNode.path("remoteJidAlt").asText("");
                if (numero.isBlank()) numero = keyNode.path("senderPn").asText("");
                if (numero.isBlank()) numero = keyNode.path("participant").asText("");
                if (numero.isBlank()) numero = dataNode.path("participant").asText("");
                if (numero.isBlank()) numero = dataNode.path("sender").asText("");

                // Limpa o sufixo @s.whatsapp.net caso algum desses campos venha formatado
                if (!numero.isBlank()) {
                    numero = numero.replace("@s.whatsapp.net", "").replaceAll("[^0-9]", "");
                }

                // Se não achou em nenhum lugar, mantém o remoteJid para avisar com segurança que não achou cadastro
                chatId = numero.isBlank() ? remoteJid : numero;
            }

            // Trata o texto da mensagem
            JsonNode messageNode = dataNode.path("message");
            String texto = "";

            if (messageNode.has("conversation")) {
                texto = messageNode.path("conversation").asText("");
            } else if (messageNode.has("extendedTextMessage")) {
                texto = messageNode.path("extendedTextMessage").path("text").asText("");
            }

            if (!texto.isBlank() && !chatId.isBlank()) {
                whatsAppService.processarMensagemRecebida(chatId, lid, texto);
            }

        } catch (Exception e) {
            log.error("[WHATSAPP WEBHOOK] Erro ao processar webhook: {}", e.getMessage(), e);
        }

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