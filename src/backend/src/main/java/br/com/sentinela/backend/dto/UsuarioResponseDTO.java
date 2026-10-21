package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Usuario;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String whatsappNumero,
        Boolean avisosWhatsapp
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getWhatsappNumero(),
                usuario.getAvisosWhatsapp()
        );
    }

    public static UsuarioResponseDTO resumido(Usuario usuario) {
        return new UsuarioResponseDTO(usuario.getId(), usuario.getNome(), usuario.getEmail(), null, null);
    }
}