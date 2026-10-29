package br.com.sentinela.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class MenuDoBotTest {

    @Test
    void cadaNumeroPedeUmaConsulta() {
        assertEquals("consulta_cultivos", MenuDoBot.intencaoDaOpcao("1"));
        assertEquals("consulta_alertas", MenuDoBot.intencaoDaOpcao("2"));
        assertEquals("consulta_previsao", MenuDoBot.intencaoDaOpcao("3"));
    }

    @Test
    void aceitaOJeitoQueAPessoaDigita() {
        assertEquals("consulta_alertas", MenuDoBot.intencaoDaOpcao(" 2 "));
        assertEquals("consulta_alertas", MenuDoBot.intencaoDaOpcao("2."));
        assertEquals("consulta_alertas", MenuDoBot.intencaoDaOpcao("2)"));
        assertEquals("consulta_alertas", MenuDoBot.intencaoDaOpcao("2\uFE0F\u20E3"));
        assertEquals("consulta_cultivos", MenuDoBot.intencaoDaOpcao("opção 1"));
        assertEquals("consulta_previsao", MenuDoBot.intencaoDaOpcao("Opcao 3"));
    }

    @Test
    void numeroNoMeioDeUmaFraseNaoEhOpcao() {
        assertNull(MenuDoBot.intencaoDaOpcao("tenho 2 lavouras"));
        assertNull(MenuDoBot.intencaoDaOpcao("previsão para os próximos 3 dias"));
    }

    @Test
    void numeroForaDoMenuNaoEhOpcao() {
        assertNull(MenuDoBot.intencaoDaOpcao("0"));
        assertNull(MenuDoBot.intencaoDaOpcao("4"));
        assertNull(MenuDoBot.intencaoDaOpcao("12"));
        assertNull(MenuDoBot.intencaoDaOpcao(""));
        assertNull(MenuDoBot.intencaoDaOpcao(null));
    }

    @Test
    void menuSozinhoAbreOMenuDeQualquerJeito() {
        assertTrue(MenuDoBot.ehPedidoDeMenu("menu"));
        assertTrue(MenuDoBot.ehPedidoDeMenu("  Menu!  "));
        assertTrue(MenuDoBot.ehPedidoDeMenu("MENU"));
        assertTrue(MenuDoBot.ehPedidoDeMenu("0"));
        assertTrue(MenuDoBot.ehPedidoDeMenu("0\uFE0F\u20E3"));
        assertTrue(MenuDoBot.ehPedidoDeMenu("Início"));
        assertTrue(MenuDoBot.ehPedidoDeMenu("voltar"));
        assertTrue(MenuDoBot.ehPedidoDeMenu("ajuda."));
    }

    @Test
    void fraseComMenuNoMeioNaoEhPedidoDeMenu() {
        assertFalse(MenuDoBot.ehPedidoDeMenu("quero ver o menu de novo"));
        assertFalse(MenuDoBot.ehPedidoDeMenu("1"));
        assertFalse(MenuDoBot.ehPedidoDeMenu(""));
        assertFalse(MenuDoBot.ehPedidoDeMenu(null));
    }
}
