package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.*;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<AuthResponseDTO> cadastrar(@Valid @RequestBody UsuarioRequestDTO dto) {
        AuthResponseDTO response = usuarioService.criarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> meuPerfil(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(usuarioService.obterMeuPerfil(usuarioLogado));
    }

    @PatchMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> atualizarPerfil(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody AtualizarUsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarMeuPerfil(usuarioLogado, dto));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirConta(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody ExcluirContaDTO dto) {
        usuarioService.excluirMinhaConta(usuarioLogado, dto);
        return ResponseEntity.noContent().build();
    }
}