package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.PainelDTO;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.service.PainelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/painel")
@RequiredArgsConstructor
public class PainelController {

    private final PainelService painelService;

    @GetMapping
    public ResponseEntity<PainelDTO> painel(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(painelService.painel(usuario));
    }
}
