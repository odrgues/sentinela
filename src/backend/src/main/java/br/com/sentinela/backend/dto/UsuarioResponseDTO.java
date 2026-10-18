package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Usuario;
import java.time.LocalDateTime;

public record UsuarioResponseDTO(
        Integer id,
        String nome,
        String email,
        String whatsappNumero,
        LocalDateTime criadoEm
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getWhatsappNumero(),
                usuario.getCriadoEm()
        );
    }
}