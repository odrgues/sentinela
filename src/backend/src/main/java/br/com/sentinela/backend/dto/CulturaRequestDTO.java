package br.com.sentinela.backend.dto;

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