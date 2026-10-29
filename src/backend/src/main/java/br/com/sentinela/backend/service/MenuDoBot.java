package br.com.sentinela.backend.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

// O menu numerado do bot: a pessoa responde "1", "2" ou "3" e recebe a resposta.
public final class MenuDoBot {

    // "1", "1.", "1)", "1️⃣" ou "opção 1", sozinhos na mensagem. Um número no meio de uma frase
    // ("tenho 2 lavouras") não conta.
    private static final Pattern OPCAO = Pattern.compile("^\\s*(?:op[cç][aã]o\\s*)?([1-3])\\D{0,3}\\s*$",
            Pattern.CASE_INSENSITIVE);

    private MenuDoBot() {}

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

    public static String rodape() {
        return "\n\nDigite *menu* para ver as opções.";
    }
}
