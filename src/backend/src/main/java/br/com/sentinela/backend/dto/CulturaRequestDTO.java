package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CulturaRequestDTO(
        @NotBlank(message = "O nome da cultura é obrigatório.")
        String nome,

        String tipoCiclo,

        @NotNull(message = "O ciclo em dias é obrigatório.")
        @Positive(message = "O ciclo em dias deve ser positivo.")
        Integer cicloDias,
        @Positive(message = "O início da colheita deve ser positivo.")
        Integer inicioColheitaDias,
        @Min(value = 1, message = "Mês entre 1 e 12.") @Max(value = 12, message = "Mês entre 1 e 12.")
        Integer mesInicioColheita,
        @Min(value = 1, message = "Mês entre 1 e 12.") @Max(value = 12, message = "Mês entre 1 e 12.")
        Integer mesFimColheita,

        Double tempMinIdealC,
        Double tempMaxIdealC,
        Double tempCriticaBaixaC,
        Double tempCriticaAltaC,
        Double chuvaSemMinMm,
        Double chuvaSemMaxMm,

        @NotBlank(message = "A fonte da documentação é obrigatória.")
        String fonte,

        String observacao
) {}