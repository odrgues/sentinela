package br.com.sentinela.backend.service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;

// Como o bot escreve as coisas no WhatsApp: *negrito*, emojis e números do jeito brasileiro.
public final class FormatoDoBot {

    private static final Locale PT_BR = Locale.of("pt", "BR");

    // O bot não entende "PARAR" por mensagem; a chave fica no site.
    public static final String COMO_PARAR =
            "Para parar de receber avisos, desligue *Receber avisos automáticos* em Minha conta, no site.";

    private FormatoDoBot() {}

    // "em_andamento" -> "em andamento"
    public static String status(String status) {
        if (status == null || status.isBlank()) return "em andamento";
        return switch (status) {
            case "em_andamento" -> "em andamento";
            case "colhido" -> "colhida";
            case "perdido" -> "perdida";
            default -> status.replace('_', ' ');
        };
    }

    // Horta pequena em m² ("300 m²"); lavoura em hectares ("45,5 ha"). Vazio se não tiver área.
    public static String area(BigDecimal hectares) {
        if (hectares == null) return "";
        if (hectares.compareTo(BigDecimal.ONE) < 0) {
            return numero(hectares.doubleValue() * 10000, "#,##0") + " m²";
        }
        return numero(hectares.doubleValue(), "#,##0.##") + " ha";
    }

    // "81,3 mm"
    public static String milimetros(double valor) {
        return numero(valor, "#,##0.#") + " mm";
    }

    // "17° a 30°"
    public static String temperaturas(double minima, double maxima) {
        return Math.round(minima) + "° a " + Math.round(maxima) + "°";
    }

    // "29/10"
    public static String dia(LocalDate data) {
        if (data == null) return "";
        return "%02d/%02d".formatted(data.getDayOfMonth(), data.getMonthValue());
    }

    // "Qua 29/10"
    public static String diaDaSemana(LocalDate data) {
        if (data == null) return "";
        String nome = data.getDayOfWeek().getDisplayName(TextStyle.SHORT, PT_BR).replace(".", "");
        return Character.toUpperCase(nome.charAt(0)) + nome.substring(1) + " " + dia(data);
    }

    // O nível do aviso, com a cor do semáforo.
    public static String nivel(String severidade) {
        if ("critico".equalsIgnoreCase(severidade)) return "🔴 *Crítico*";
        if ("atencao".equalsIgnoreCase(severidade)) return "🟡 *Atenção*";
        return "🟢 *Tudo certo*";
    }

    private static String numero(double valor, String padrao) {
        return new DecimalFormat(padrao, DecimalFormatSymbols.getInstance(PT_BR)).format(valor);
    }
}
