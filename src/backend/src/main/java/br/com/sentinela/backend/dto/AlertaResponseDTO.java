package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Alerta;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AlertaResponseDTO(
        Long id,
        Long cultivoId,
        String cultivoApelido,
        String municipioNome,
        String culturaNome,
        String tipo,
        String severidade,
        String mensagem,
        LocalDate dataPrevista,
        LocalDateTime geradoEm
) {
    public AlertaResponseDTO(Alerta alerta) {
        this(
                alerta.getId(),
                alerta.getCultivo().getId(),
                alerta.getCultivo().getApelido(),
                alerta.getCultivo().getMunicipio().getNome(),
                alerta.getCultivo().getCultura().getNome(),
                alerta.getTipo(),
                alerta.getSeveridade(),
                alerta.getMensagem(),
                alerta.getDataPrevista(),
                alerta.getGeradoEm()
        );
    }
}