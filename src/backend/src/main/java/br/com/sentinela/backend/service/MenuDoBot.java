package br.com.sentinela.backend.service;

import java.text.Normalizer;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// O menu numerado do bot: a pessoa responde "1", "2" ou "3" e recebe a resposta.
public final class MenuDoBot {

    // "1", "1.", "1)", "1️⃣" ou "opção 1", sozinhos na mensagem. Um número no meio de uma frase
    // ("tenho 2 lavouras") não conta.
    private static final Pattern OPCAO = Pattern.compile("^\\s*(?:op[cç][aã]o\\s*)?([1-3])\\D{0,3}\\s*$",
            Pattern.CASE_INSENSITIVE);

    // "menu", "Menu!", "0", "voltar", "início", "ajuda", sozinhos na mensagem: abrem o menu.
    private static final Set<String> PEDIDOS_DE_MENU = Set.of("menu", "0", "inicio", "voltar", "ajuda", "opcoes");

    // "sair", "tchau", "obrigada", "até logo", sozinhos na mensagem: encerram a conversa.
    private static final Set<String> PEDIDOS_DE_SAIDA = Set.of(
            "sair", "tchau", "encerrar", "fim", "obrigado", "obrigada", "valeu", "atelogo", "atemais");

    private MenuDoBot() {}

    // Sem acento, sem pontuação e sem emoji, como no menu.
    private static String simplificar(String texto) {
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^\\p{L}\\p{N}]", "")
                .toLowerCase();
    }

    public static boolean ehPedidoDeSaida(String texto) {
        return texto != null && PEDIDOS_DE_SAIDA.contains(simplificar(texto));
    }

    // A despedida: diz como retomar a conversa e lembra que os avisos críticos continuam.
    public static String despedida(String nome) {
        return "👋 *Até logo, " + nome + "!*\n\n"
                + "Foi um prazer ajudar com as suas lavouras.\n"
                + "Para retomar a conversa, é só digitar *oi*.\n\n"
                + "_Os avisos críticos continuam chegando por aqui. Para desligar, use Minha conta, no site._";
    }

    // Sem acento, sem pontuação, sem emoji: "Início!" e "0️⃣" viram "inicio" e "0".
    public static boolean ehPedidoDeMenu(String texto) {
        return texto != null && PEDIDOS_DE_MENU.contains(simplificar(texto));
    }

    // A intenção que a opção escolhida pede, ou null se a mensagem não for uma opção do menu.
    public static String intencaoDaOpcao(String texto) {
        if (texto == null) return null;
        Matcher opcao = OPCAO.matcher(texto);
        if (!opcao.matches()) return null;
        return switch (opcao.group(1)) {
            case "1" -> "consulta_cultivos";
            case "2" -> "consulta_alertas";
            default -> "consulta_previsao";
        };
    }

    public static String opcoes() {
        return "*1* - Minhas lavouras\n"
                + "*2* - Avisos da semana\n"
                + "*3* - Previsão do tempo";
    }

    // O fim de toda resposta de consulta: o menu de novo, para a pessoa escolher a próxima sem digitar "menu".
    public static String rodape() {
        return "\n\n*Quer ver mais?* Responda com o número:\n\n" + opcoes() + "\n\n_Digite *sair* para encerrar._";
    }
}
