package br.com.sentinela.backend.dto;

import java.util.List;

public record ClimaResponseDTO(
        String municipio,
        String uf,
        Double tempMinSemana,
        Double tempMaxSemana,
        Double chuvaAcumuladaSemanaMm,
        List<PrevisaoDiariaDTO> previsaoDiaria
) {
    public record PrevisaoDiariaDTO(
            String data,
            Double tempMin,
            Double tempMax,
            Double chuvaMm
    ) {}
}