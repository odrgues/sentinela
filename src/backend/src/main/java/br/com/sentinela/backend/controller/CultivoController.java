package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.CultivoRequestDTO;
import br.com.sentinela.backend.dto.CultivoResponseDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.service.CultivoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cultivos")
@RequiredArgsConstructor
public class CultivoController {

    private final CultivoService cultivoService;

    @GetMapping
    public ResponseEntity<List<CultivoResponseDTO>> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(cultivoService.listarPorUsuario(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CultivoResponseDTO> obterPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(cultivoService.obterPorId(id, usuario));
    }

    @PostMapping
    public ResponseEntity<CultivoResponseDTO> cadastrar(
            @Valid @RequestBody CultivoRequestDTO dto,
            @AuthenticationPrincipal Usuario usuario) {
        CultivoResponseDTO salvo = cultivoService.cadastrar(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        cultivoService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CultivoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal Usuario usuario) {

        String novoStatus = payload.get("status");
        CultivoResponseDTO dto = cultivoService.atualizarStatus(id, usuario.getId(), novoStatus);
        return ResponseEntity.ok(dto);
    }
}