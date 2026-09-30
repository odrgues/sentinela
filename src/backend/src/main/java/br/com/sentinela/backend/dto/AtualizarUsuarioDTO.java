package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AtualizarUsuarioDTO {

    @Size(max = 160, message = "O nome deve ter no máximo 160 caracteres.")
    private String nome;

    @Email(message = "Insira um e-mail válido")
    @Size(max = 160, message = "O e-mail deve ter no máximo 160 caracteres")
    private String email;

    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String senha;

    @Size(max = 20, message = "O número de WhatsApp deve ter no máximo 20 caracteres")
    private String whatsappNumero;

}
