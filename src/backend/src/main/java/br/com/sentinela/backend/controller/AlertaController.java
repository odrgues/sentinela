package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.AlertaResponseDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.AlertaRepository;
import br.com.sentinela.backend.service.AlertaEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaRepository alertaRepository;
    private final AlertaEngineService alertaEngineService;

    @GetMapping
    public ResponseEntity<List<AlertaResponseDTO>> listarAlertasDoUsuario(@AuthenticationPrincipal Usuario usuario) {
        List<AlertaResponseDTO> alertas = alertaRepository.findByCultivoUsuarioIdOrderByDataPrevistaDesc(usuario.getId())
                .stream()
                .map(AlertaResponseDTO::new)
                .toList();

        return ResponseEntity.ok(alertas);
    }

    @PostMapping("/processar/cultivo/{cultivoId}")
    public ResponseEntity<List<AlertaResponseDTO>> processarAlertasDoCultivo(@PathVariable Long cultivoId) {
        var alertas = alertaEngineService.processarAlertasParaCultivo(cultivoId);
        List<AlertaResponseDTO> dtos = alertas.stream().map(AlertaResponseDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }
}