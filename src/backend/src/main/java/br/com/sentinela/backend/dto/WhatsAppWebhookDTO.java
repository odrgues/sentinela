package br.com.sentinela.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record WhatsAppWebhookDTO(
        @JsonProperty("chat_id") String chatId,
        String texto,
        String intencao
) {}