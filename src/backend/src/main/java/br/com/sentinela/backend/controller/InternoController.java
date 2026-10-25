package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.MensagemResponseDTO;
import br.com.sentinela.backend.service.AgendadorAlertasService;
import br.com.sentinela.backend.service.AtualizadorEnsoService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Só no perfil dev: roda na hora as rotinas agendadas, para testar e demonstrar sem esperar.
@Profile("dev")
@RestController
@RequestMapping("/api/interno")
@RequiredArgsConstructor
public class InternoController {

    private final AgendadorAlertasService agendador;
    private final AtualizadorEnsoService atualizadorEnso;

    @PostMapping("/rodar-rotina")
    public ResponseEntity<Void> rodarRotina() {
        agendador.executarProcessamentoDiario();
        return ResponseEntity.noContent().build();
    }

    // A rotina do dia 6: busca a série do El Niño na NOAA e grava os meses novos.
    @PostMapping("/atualizar-enso")
    public ResponseEntity<MensagemResponseDTO> atualizarEnso() {
        int meses = atualizadorEnso.atualizar();
        return ResponseEntity.ok(new MensagemResponseDTO(meses + " meses gravados a partir de 2015."));
    }
}
