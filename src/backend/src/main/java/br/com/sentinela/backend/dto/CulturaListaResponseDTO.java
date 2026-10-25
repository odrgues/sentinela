package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.service.CicloDaCultura;

public record CulturaListaResponseDTO(
        Long id,
        String nome,
        Integer cicloDias,
        String tipoCiclo,
        String descricaoCiclo
) {
    public CulturaListaResponseDTO(Cultura cultura) {
        this(
                cultura.getId(),
                cultura.getNome(),
                cultura.getCicloDias(),
                cultura.getTipoCiclo(),
                CicloDaCultura.descricao(cultura)
        );
    }
}