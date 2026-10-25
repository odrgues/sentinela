package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.AlertaResponseDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.AlertaRepository;
import br.com.sentinela.backend.service.AgendadorAlertasService;
import br.com.sentinela.backend.service.CultivoService;
import br.com.sentinela.backend.service.OrientacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaRepository alertaRepository;
    private final OrientacaoService orientacaoService;
    private final CultivoService cultivoService;
    private final AgendadorAlertasService agendador;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<AlertaResponseDTO>> listarAlertasDoUsuario(@AuthenticationPrincipal Usuario usuario) {
        List<AlertaResponseDTO> alertas = alertaRepository.findByCultivoUsuarioIdOrderByDataPrevistaDesc(usuario.getId())
                .stream()
                .map(alerta -> new AlertaResponseDTO(alerta,
                        orientacaoService.oQueFazer(alerta.getCultivo().getCultura(), alerta.getTipo())))
                .toList();

        return ResponseEntity.ok(alertas);
    }

    // Busca a previsão e refaz os avisos de uma lavoura do usuário na hora.
    @PostMapping("/processar/cultivo/{cultivoId}")
    public ResponseEntity<Void> processarAlertasDoCultivo(
            @PathVariable Long cultivoId,
            @AuthenticationPrincipal Usuario usuario) {
        agendador.processarCultivo(cultivoService.buscarDoUsuario(cultivoId, usuario));
        return ResponseEntity.noContent().build();
    }
}
