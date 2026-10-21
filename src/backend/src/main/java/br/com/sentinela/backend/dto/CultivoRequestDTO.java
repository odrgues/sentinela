package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CultivoRequestDTO(
        @NotNull(message = "O município é obrigatório.")
        Long municipioId,

        @NotNull(message = "A cultura é obrigatória.")
        Long culturaId,

        @NotBlank(message = "O apelido do cultivo é obrigatório.")
        String apelido,

        @NotNull(message = "A área em hectares é obrigatória.")
        @Positive(message = "A área deve ser maior que zero.")
        BigDecimal areaHa,

        @NotNull(message = "A data de plantio é obrigatória.")
        LocalDate dataPlantio,

        LocalDate dataColheitaPrevista
) {}