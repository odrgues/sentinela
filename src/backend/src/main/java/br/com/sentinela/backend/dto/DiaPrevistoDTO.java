package br.com.sentinela.backend.dto;

import java.time.LocalDate;

// Um dia da previsão da Open-Meteo, já sem os nomes em inglês.
public record DiaPrevistoDTO(
        LocalDate data,
        double tempMinC,
        double tempMaxC,
        double chuvaMm,
        int codigoTempo
) {
    public double tempMediaC() {
        return (tempMinC + tempMaxC) / 2;
    }
}
