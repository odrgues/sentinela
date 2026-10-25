package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

// PATCH /api/cultivos/{id}: só os campos que mudaram, mais status ("colhido" ou "perdido").
// É uma classe para diferenciar "areaHa": null (apagar a área) de o campo nem ter vindo.
@Getter
@Setter
public class EditarCultivoDTO {

    private Long culturaId;

    @Size(min = 1, max = 80, message = "O nome deve ter de 1 a 80 caracteres.")
    private String apelido;

    private LocalDate dataPlantio;

    @Positive(message = "A área deve ser maior que zero.")
    private BigDecimal areaHa;

    private boolean areaInformada;

    @DecimalMin(value = "-90", message = "Latitude inválida.")
    @DecimalMax(value = "90", message = "Latitude inválida.")
    private Double latitude;

    @DecimalMin(value = "-180", message = "Longitude inválida.")
    @DecimalMax(value = "180", message = "Longitude inválida.")
    private Double longitude;

    @Size(max = 120, message = "Nome de cidade longo demais.")
    private String cidade;

    @Size(min = 2, max = 2, message = "Use a sigla do estado.")
    private String uf;

    private String status;

    public void setAreaHa(BigDecimal areaHa) {
        this.areaHa = areaHa;
        this.areaInformada = true;
    }
}
