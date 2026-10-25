package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.CultivoRequestDTO;
import br.com.sentinela.backend.dto.CultivoResponseDTO;
import br.com.sentinela.backend.dto.DetalheCultivoDTO;
import br.com.sentinela.backend.dto.EditarCultivoDTO;
import br.com.sentinela.backend.dto.HistoricoDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.service.CultivoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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
    public ResponseEntity<DetalheCultivoDTO> detalhe(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(cultivoService.detalhe(id, usuario));
    }

    @GetMapping("/{id}/alertas")
    public ResponseEntity<HistoricoDTO> historico(
            @PathVariable Long id,
            @RequestParam(required = false) String severidade,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate,
            @RequestParam(defaultValue = "0") int pagina,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(cultivoService.historico(id, usuario, severidade, tipo, de, ate, pagina));
    }

    @PostMapping
    public ResponseEntity<CultivoResponseDTO> cadastrar(
            @Valid @RequestBody CultivoRequestDTO dto,
            @AuthenticationPrincipal Usuario usuario) {
        CultivoResponseDTO salvo = cultivoService.cadastrar(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // Editar a lavoura ou marcar como colhida/perdida: { "status": "colhido" }.
    @PatchMapping("/{id}")
    public ResponseEntity<CultivoResponseDTO> editar(
            @PathVariable Long id,
            @Valid @RequestBody EditarCultivoDTO dto,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(cultivoService.editar(id, dto, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        cultivoService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
