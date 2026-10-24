package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.model.FaseEnso;
import br.com.sentinela.backend.service.FaseEnsoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enso")
@RequiredArgsConstructor
public class FaseEnsoController {

    private final FaseEnsoService faseEnsoService;

    @GetMapping("/atual")
    public ResponseEntity<FaseEnso> obterFaseAtual() {
        FaseEnso fase = faseEnsoService.buscarFaseAtual();
        return ResponseEntity.ok(fase);
    }

    @GetMapping("/historico")
    public ResponseEntity<List<FaseEnso>> listarHistorico() {
        List<FaseEnso> historico = faseEnsoService.listarHistorico();
        return ResponseEntity.ok(historico);
    }
}