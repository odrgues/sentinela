package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

// POST /api/cultivos. latitude e longitude vêm do centro do mapa; cidade e uf, do Google.
public record CultivoRequestDTO(
        @NotNull(message = "Escolha a cultura.")
        Long culturaId,

        @NotBlank(message = "Dê um nome para a lavoura.")
        @Size(max = 80, message = "O nome deve ter até 80 caracteres.")
        String apelido,

        @NotNull(message = "Informe a data de plantio.")
        LocalDate dataPlantio,

        @Positive(message = "A área deve ser maior que zero.")
        BigDecimal areaHa,

        @NotNull(message = "Marque a lavoura no mapa.")
        @DecimalMin(value = "-90", message = "Latitude inválida.")
        @DecimalMax(value = "90", message = "Latitude inválida.")
        Double latitude,

        @NotNull(message = "Marque a lavoura no mapa.")
        @DecimalMin(value = "-180", message = "Longitude inválida.")
        @DecimalMax(value = "180", message = "Longitude inválida.")
        Double longitude,

        @NotBlank(message = "Não identificamos a cidade do ponto marcado.")
        @Size(max = 120, message = "Nome de cidade longo demais.")
        String cidade,

        @NotBlank(message = "Não identificamos o estado do ponto marcado.")
        @Size(min = 2, max = 2, message = "Use a sigla do estado.")
        String uf
) {}
