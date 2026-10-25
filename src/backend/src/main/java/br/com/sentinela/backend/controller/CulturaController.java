package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.CulturaDetalheResponseDTO;
import br.com.sentinela.backend.dto.CulturaListaResponseDTO;
import br.com.sentinela.backend.dto.CulturaRequestDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.service.CulturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/culturas")
@RequiredArgsConstructor
public class CulturaController {

    private final CulturaService culturaService;

    @GetMapping
    public ResponseEntity<List<CulturaListaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(culturaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CulturaDetalheResponseDTO> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(culturaService.obterPorId(id));
    }

    @PostMapping
    public ResponseEntity<CulturaDetalheResponseDTO> cadastrar(
            @Valid @RequestBody CulturaRequestDTO dto,
            @AuthenticationPrincipal Usuario usuario) {
        culturaService.exigirAdmin(usuario);
        CulturaDetalheResponseDTO salva = culturaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CulturaDetalheResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody CulturaRequestDTO dto,
            @AuthenticationPrincipal Usuario usuario) {
        culturaService.exigirAdmin(usuario);
        CulturaDetalheResponseDTO atualizada = culturaService.atualizar(id, dto);
        return ResponseEntity.ok(atualizada);
    }
}