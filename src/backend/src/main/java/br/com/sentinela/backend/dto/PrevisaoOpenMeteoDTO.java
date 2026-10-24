package br.com.sentinela.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record PrevisaoOpenMeteoDTO(
        Double latitude,
        Double longitude,
        @JsonProperty("daily") DailyData daily
) {
    public record DailyData(
            List<String> time,
            @JsonProperty("temperature_2m_max") List<Double> temperature2mMax,
            @JsonProperty("temperature_2m_min") List<Double> temperature2mMin,
            @JsonProperty("precipitation_sum") List<Double> precipitationSum
    ) {}
}