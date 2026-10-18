package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;


public record AtualizarUsuarioDTO (

    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    String nome,

    @Email(message = "Insira um e-mail válido")
    @Size(max = 160, message = "O e-mail deve ter no máximo 160 caracteres")
    String email,

    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    String senha,

    @Size(max = 20, message = "O número de WhatsApp deve ter no máximo 20 caracteres")
    String whatsappNumero

) {}
