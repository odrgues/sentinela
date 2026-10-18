package br.com.sentinela.backend.dto;

public record AuthResponseDTO(
        String token,
        UsuarioResponseDTO usuario
) {}