package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Cultura;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class TextosTest {

    private static final LocalDate DOMINGO = LocalDate.of(2026, 10, 25);

    @Test
    void numeroSemCasaQuandoInteiroEComVirgulaQuandoNao() {
        assertThat(Textos.numero(36.0)).isEqualTo("36");
        assertThat(Textos.numero(9.45)).isEqualTo("9,5");
        assertThat(Textos.numero(-1.0)).isEqualTo("-1");
    }

    @Test
    void diaDaSemanaComArtigoCerto() {
        assertThat(Textos.quandoComData(LocalDate.of(2026, 10, 29))).isEqualTo("na quinta (29/10)");
        assertThat(Textos.quandoComData(LocalDate.of(2026, 10, 31))).isEqualTo("no sábado (31/10)");
        assertThat(Textos.quandoRelativo(DOMINGO, DOMINGO)).isEqualTo("hoje");
        assertThat(Textos.quandoRelativo(DOMINGO.plusDays(1), DOMINGO)).isEqualTo("amanhã");
        assertThat(Textos.quandoRelativo(DOMINGO.plusDays(4), DOMINGO)).isEqualTo("na quinta");
    }

    @Test
    void fonteCurtaFicaSoComAInstituicao() {
        assertThat(Textos.fonteCurta("Embrapa — Agência de Informação Tecnológica, Soja / Exigências Climáticas"))
                .isEqualTo("Embrapa");
        assertThat(Textos.fonteCurta("Embrapa Milho e Sorgo (Sistema de Produção Cultivo do Sorgo); MAPA ZARC"))
                .isEqualTo("Embrapa Milho e Sorgo");
    }

    @Test
    void codigoDoTempoViraIconeDoFront() {
        assertThat(Textos.condicao(0)).isEqualTo("sol");
        assertThat(Textos.condicao(2)).isEqualTo("sol_nuvens");
        assertThat(Textos.condicao(45)).isEqualTo("nublado");
        assertThat(Textos.condicao(61)).isEqualTo("chuva");
        assertThat(Textos.condicao(95)).isEqualTo("tempestade");
    }

    @Test
    void avisoCurtoDoPainel() {
        Cultura soja = cultura("Soja", 10.0);
        assertThat(Textos.avisoCurto("calor", "critico", DOMINGO.plusDays(4), DOMINGO, soja)).isEqualTo("Calor forte na quinta");
        assertThat(Textos.avisoCurto("deficit_hidrico", "atencao", DOMINGO, DOMINGO, soja)).isEqualTo("Pouca chuva na semana");
        assertThat(Textos.avisoCurto("favoravel", "info", DOMINGO, DOMINGO, soja)).isEqualTo("Tudo certo esta semana");
    }

    @Test
    void geadaSoQuandoOLimiteDeFrioEPertoDeZero() {
        Cultura morango = cultura("Morango", 4.0);
        Cultura banana = cultura("Banana", 12.0);
        LocalDate terca = DOMINGO.plusDays(2);

        assertThat(Textos.avisoCurto("geada", "critico", terca, DOMINGO, morango)).isEqualTo("Risco de geada na terça");
        assertThat(Textos.avisoCurto("geada", "critico", terca, DOMINGO, banana)).isEqualTo("Frio forte na terça");
        assertThat(Textos.mensagemGeada(banana, terca, 10.4))
                .isEqualTo("Frio de 10,4 °C na terça (27/10), abaixo do limite de 12 °C para banana.");
        assertThat(Textos.mensagemGeada(morango, terca, 2))
                .isEqualTo("Frio de 2 °C na terça (27/10). Risco de geada para morango, que sofre abaixo de 4 °C.");
    }

    private static Cultura cultura(String nome, double criticaBaixa) {
        Cultura cultura = new Cultura();
        cultura.setNome(nome);
        cultura.setTempCriticaBaixaC(criticaBaixa);
        return cultura;
    }
}
