package br.com.sentinela.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;

// "Hoje" sempre no fuso do produtor, mesmo com o servidor em UTC.
public final class Agora {

    public static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");

    private Agora() {}

    public static LocalDate hoje() {
        return LocalDate.now(ZONA);
    }

    public static LocalDateTime agora() {
        return LocalDateTime.now(ZONA);
    }

    // Para a API: "2026-10-11T07:00:00-03:00".
    public static OffsetDateTime comFuso(LocalDateTime momento) {
        return momento == null ? null : momento.atZone(ZONA).toOffsetDateTime();
    }
}
