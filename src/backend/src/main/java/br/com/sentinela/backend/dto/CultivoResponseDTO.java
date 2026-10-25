package br.com.sentinela.backend.dto;

import br.com.sentinela.backend.model.Cultivo;

import java.time.LocalDate;

// Resposta do POST e do PATCH de /api/cultivos.
public record CultivoResponseDTO(
        Long id,
        String apelido,
        String cultura,
        Long culturaId,
        LocalDate dataPlantio,
        LocalDate colheitaPrevista,
        Double areaHa,
        Double latitude,
        Double longitude,
        String municipio,
        String status
) {
    public CultivoResponseDTO(Cultivo cultivo) {
        this(
                cultivo.getId(),
                cultivo.getApelido(),
                cultivo.getCultura().getNome(),
                cultivo.getCultura().getId(),
                cultivo.getDataPlantio(),
                cultivo.getDataColheitaPrevista(),
                cultivo.getAreaHa() == null ? null : cultivo.getAreaHa().doubleValue(),
                cultivo.getLatitude(),
                cultivo.getLongitude(),
                nomeDoMunicipio(cultivo),
                cultivo.getStatus()
        );
    }

    // "Uberaba – MG"
    public static String nomeDoMunicipio(Cultivo cultivo) {
        return cultivo.getMunicipio().getNome() + " – " + cultivo.getMunicipio().getUf();
    }
}
