package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Cultivo;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CultivoResponseDTO(
        Long id,
        String apelido,
        BigDecimal areaHa,
        LocalDate dataPlantio,
        LocalDate dataColheitaPrevista,
        String status,
        String municipioNome,
        String uf,
        String culturaNome
) {
    public CultivoResponseDTO(Cultivo cultivo) {
        this(
                cultivo.getId(),
                cultivo.getApelido(),
                cultivo.getAreaHa(),
                cultivo.getDataPlantio(),
                cultivo.getDataColheitaPrevista(),
                cultivo.getStatus(),
                cultivo.getMunicipio().getNome(),
                cultivo.getMunicipio().getUf(),
                cultivo.getCultura().getNome()
        );
    }
}