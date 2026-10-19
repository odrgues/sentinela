package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Cultura;

public record CulturaListaResponseDTO(
        Long id,
        String nome,
        Integer cicloDias,
        String tipoCiclo
) {
    public CulturaListaResponseDTO(Cultura cultura) {
        this(
                cultura.getId(),
                cultura.getNome(),
                cultura.getCicloDias(),
                cultura.getTipoCiclo()
        );
    }
}