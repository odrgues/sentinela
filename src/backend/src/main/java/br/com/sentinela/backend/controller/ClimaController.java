package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.ClimaResponseDTO;
import br.com.sentinela.backend.service.ClimaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clima")
@RequiredArgsConstructor
public class ClimaController {

    private final ClimaService climaService;

    @GetMapping("/municipio/{municipioId}")
    public ResponseEntity<ClimaResponseDTO> obterPrevisao(@PathVariable Long municipioId) {
        return ResponseEntity.ok(climaService.buscarPrevisaoPorMunicipio(municipioId));
    }
}