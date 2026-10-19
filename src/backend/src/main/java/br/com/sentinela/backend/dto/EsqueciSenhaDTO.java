package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EsqueciSenhaDTO(
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Insira um e-mail válido.")
        String email
) {
}
