package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Cultura;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class CicloDaCulturaTest {

    private static final LocalDate HOJE = LocalDate.of(2026, 10, 11);

    private static Cultura cultura(String tipo, int ciclo) {
        Cultura cultura = new Cultura();
        cultura.setNome("Teste");
        cultura.setTipoCiclo(tipo);
        cultura.setCicloDias(ciclo);
        return cultura;
    }

    @Test
    void anualColheNoFimDoCiclo() {
        Cultura soja = cultura("anual", 120);
        LocalDate plantio = LocalDate.of(2026, 8, 27);

        LocalDate colheita = CicloDaCultura.colheitaPrevista(soja, plantio, HOJE);

        assertThat(colheita).isEqualTo(LocalDate.of(2026, 12, 25));
        assertThat(CicloDaCultura.cicloDias(soja, plantio, colheita)).isEqualTo(120);
        assertThat(CicloDaCultura.diaAtual(soja, plantio, colheita, HOJE)).isEqualTo(45);
        assertThat(CicloDaCultura.safra(soja, colheita)).isNull();
        assertThat(CicloDaCultura.descricao(soja)).isEqualTo("Ciclo de 120 dias");
    }

    @Test
    void canaPlantadaNoVeraoEDeAnoEMeio() {
        Cultura cana = cultura("cana", 365);

        assertThat(CicloDaCultura.colheitaPrevista(cana, LocalDate.of(2026, 2, 10), HOJE))
                .isEqualTo(LocalDate.of(2026, 2, 10).plusDays(540));
        assertThat(CicloDaCultura.colheitaPrevista(cana, LocalDate.of(2026, 6, 10), HOJE))
                .isEqualTo(LocalDate.of(2026, 6, 10).plusDays(365));
    }

    @Test
    void cafeTemSafraEColheNoProximoMaio() {
        Cultura cafe = cultura("perene", 365);
        cafe.setMesInicioColheita(5);
        cafe.setMesFimColheita(8);

        LocalDate colheita = CicloDaCultura.colheitaPrevista(cafe, LocalDate.of(2019, 11, 1), HOJE);

        assertThat(colheita).isEqualTo(LocalDate.of(2027, 5, 1));
        assertThat(CicloDaCultura.safra(cafe, colheita)).isEqualTo("2026/27");
        assertThat(CicloDaCultura.diaAtual(cafe, LocalDate.of(2019, 11, 1), colheita, HOJE)).isNull();
        assertThat(CicloDaCultura.descricao(cafe)).isEqualTo("Perene · colheita de maio a agosto");
        assertThat(CicloDaCultura.explicacao(cafe)).isEqualTo("A colheita vai de maio a agosto.");
    }

    @Test
    void pereneSemSafraMostraAPrimeiraColheita() {
        Cultura banana = cultura("perene", 365);
        LocalDate plantio = LocalDate.of(2026, 3, 1);

        assertThat(CicloDaCultura.colheitaPrevista(banana, plantio, HOJE)).isEqualTo(plantio.plusDays(365));
        assertThat(CicloDaCultura.safra(banana, plantio.plusDays(365))).isNull();
        assertThat(CicloDaCultura.explicacao(banana)).isNull();
        assertThat(CicloDaCultura.descricao(banana)).isEqualTo("Perene · primeira colheita em cerca de 12 meses");
    }

    @Test
    void colheitaContinuaComecaNoMeioDoCiclo() {
        Cultura morango = cultura("continua", 220);
        morango.setInicioColheitaDias(70);
        LocalDate plantio = LocalDate.of(2026, 5, 1);

        LocalDate colheita = CicloDaCultura.colheitaPrevista(morango, plantio, HOJE);

        assertThat(colheita).isEqualTo(plantio.plusDays(70));
        assertThat(CicloDaCultura.cicloDias(morango, plantio, colheita)).isEqualTo(220);
        assertThat(CicloDaCultura.diaAtual(morango, plantio, colheita, HOJE)).isEqualTo(163);
        assertThat(CicloDaCultura.descricao(morango)).isEqualTo("Colhe a partir de 70 dias, por 5 meses");
    }

    @Test
    void diaAtualNaoPassaDoCicloNemFicaNegativo() {
        Cultura feijao = cultura("anual", 90);

        LocalDate plantioFuturo = HOJE.plusDays(10);
        assertThat(CicloDaCultura.diaAtual(feijao, plantioFuturo, plantioFuturo.plusDays(90), HOJE)).isZero();

        LocalDate plantioAntigo = HOJE.minusDays(200);
        assertThat(CicloDaCultura.diaAtual(feijao, plantioAntigo, plantioAntigo.plusDays(90), HOJE)).isEqualTo(90);
    }
}
