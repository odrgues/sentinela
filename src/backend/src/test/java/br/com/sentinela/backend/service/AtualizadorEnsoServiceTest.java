package br.com.sentinela.backend.service;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class AtualizadorEnsoServiceTest {

    // Trecho no formato do oni.ascii.txt da NOAA.
    private static final String ARQUIVO = """
             SEAS  YR   TOTAL   ANOM
              DJF 2014  26.18  -0.41
              NDJ 2015  29.17   2.59
              DJF 2026  26.12  -0.39
              AMJ 2026  28.89   0.95
              MJJ 2026  28.87   1.39
              JAS 2026  28.94   2.16
              OND 2025  26.20  -0.57
            """;

    @Test
    void cadaTemporadaVaiParaOMesDoMeioEAntesDe2015FicaDeFora() {
        var meses = AtualizadorEnsoService.lerArquivo(ARQUIVO);

        assertThat(meses).hasSize(6);
        assertThat(meses.get(0)).isEqualTo(new AtualizadorEnsoService.MesDoOni(2015, 12, "El Nino", "muito forte", new BigDecimal("2.59")));
        assertThat(meses.get(1)).isEqualTo(new AtualizadorEnsoService.MesDoOni(2026, 1, "Neutro", null, new BigDecimal("-0.39")));
        assertThat(meses.get(4).mes()).isEqualTo(8);
    }

    @Test
    void classificaComoNoSeedDaEspecificacao() {
        assertThat(AtualizadorEnsoService.classificar(2026, 5, new BigDecimal("0.95")).intensidade()).isEqualTo("fraco");
        assertThat(AtualizadorEnsoService.classificar(2026, 6, new BigDecimal("1.39")).intensidade()).isEqualTo("moderado");
        assertThat(AtualizadorEnsoService.classificar(2026, 7, new BigDecimal("1.80")).intensidade()).isEqualTo("forte");
        assertThat(AtualizadorEnsoService.classificar(2026, 4, new BigDecimal("0.46")).fase()).isEqualTo("Neutro");
        assertThat(AtualizadorEnsoService.classificar(2025, 11, new BigDecimal("-0.61")))
                .isEqualTo(new AtualizadorEnsoService.MesDoOni(2025, 11, "La Nina", "fraco", new BigDecimal("-0.61")));
    }
}
