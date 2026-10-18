package br.com.sentinela.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErroResponseDTO(
        Integer status,
        String mensagem,
        Map<String, String> campos
) {
    public ErroResponseDTO(Integer status, String mensagem) {
        this(status, mensagem, null);
    }
}