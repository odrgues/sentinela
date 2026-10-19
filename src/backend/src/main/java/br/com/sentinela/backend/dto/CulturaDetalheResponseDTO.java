package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Cultura;

public record CulturaDetalheResponseDTO(
        Long id,
        String nome,
        String tipoCiclo,
        Integer cicloDias,
        Double tempMinIdealC,
        Double tempMaxIdealC,
        Double tempCriticaBaixaC,
        Double tempCriticaAltaC,
        Double chuvaSemMinMm,
        Double chuvaSemMaxMm,
        String fonte,
        String observacao
) {
    public CulturaDetalheResponseDTO(Cultura cultura) {
        this(
                cultura.getId(),
                cultura.getNome(),
                cultura.getTipoCiclo(),
                cultura.getCicloDias(),
                cultura.getTempMinIdealC(),
                cultura.getTempMaxIdealC(),
                cultura.getTempCriticaBaixaC(),
                cultura.getTempCriticaAltaC(),
                cultura.getChuvaSemMinMm(),
                cultura.getChuvaSemMaxMm(),
                cultura.getFonte(),
                cultura.getObservacao()
        );
    }
}