package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Usuario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UsuarioResponseDTO {

    private Integer id;
    private String nome;
    private String email;
    private String whatsappNumero;
    private LocalDateTime criadoEm;

    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.whatsappNumero = usuario.getWhatsappNumero();
        this.criadoEm = usuario.getCriadoEm();
    }
}