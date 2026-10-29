package br.com.sentinela.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class FormatoDoBotTest {

    @Test
    void statusEmPortugues() {
        assertEquals("em andamento", FormatoDoBot.status("em_andamento"));
        assertEquals("colhida", FormatoDoBot.status("colhido"));
        assertEquals("perdida", FormatoDoBot.status("perdido"));
        assertEquals("em andamento", FormatoDoBot.status(null));
    }

    @Test
    void areaEmHectaresOuMetrosQuadrados() {
        assertEquals("45,5 ha", FormatoDoBot.area(new BigDecimal("45.5000")));
        assertEquals("12 ha", FormatoDoBot.area(new BigDecimal("12.0000")));
        assertEquals("300 m²", FormatoDoBot.area(new BigDecimal("0.0300")));
        assertEquals("", FormatoDoBot.area(null));
    }

    @Test
    void numerosDoJeitoBrasileiro() {
        assertEquals("81,3 mm", FormatoDoBot.milimetros(81.3));
        assertEquals("0 mm", FormatoDoBot.milimetros(0));
        assertEquals("17° a 30°", FormatoDoBot.temperaturas(17.4, 29.6));
    }

    @Test
    void datasCurtas() {
        LocalDate quartaFeira = LocalDate.of(2026, 10, 28);

        assertEquals("28/10", FormatoDoBot.dia(quartaFeira));
        assertEquals("Qua 28/10", FormatoDoBot.diaDaSemana(quartaFeira));
        assertEquals("Dom 01/11", FormatoDoBot.diaDaSemana(LocalDate.of(2026, 11, 1)));
    }

    @Test
    void nivelComCorDoSemaforo() {
        assertEquals("🔴 *Crítico*", FormatoDoBot.nivel("critico"));
        assertEquals("🟡 *Atenção*", FormatoDoBot.nivel("atencao"));
        assertEquals("🟢 *Tudo certo*", FormatoDoBot.nivel("info"));
    }
}
