package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Cultura;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

// As frases que o produtor lê: o backend traduz a previsão, o front só exibe.
public final class Textos {

    private static final Locale PT_BR = Locale.of("pt", "BR");
    private static final DateTimeFormatter DIA_E_MES = DateTimeFormatter.ofPattern("dd/MM");

    private Textos() {}

    // 36.0 vira "36"; 9.45 vira "9,5".
    public static String numero(double valor) {
        double arredondado = Math.round(valor * 10) / 10.0;
        if (arredondado == Math.rint(arredondado)) {
            return String.valueOf((long) arredondado);
        }
        return String.format(PT_BR, "%.1f", arredondado);
    }

    // "na quinta (30/10)", "no sábado (01/11)". Vai gravado na mensagem do alerta, então
    // não pode usar "hoje" ou "amanhã", que mudam de sentido no dia seguinte.
    public static String quandoComData(LocalDate data) {
        return diaDaSemanaComArtigo(data) + " (" + data.format(DIA_E_MES) + ")";
    }

    // "hoje", "amanhã", "na quinta": para as frases montadas na hora de mostrar.
    public static String quandoRelativo(LocalDate data, LocalDate hoje) {
        if (data.equals(hoje)) return "hoje";
        if (data.equals(hoje.plusDays(1))) return "amanhã";
        return diaDaSemanaComArtigo(data);
    }

    private static String diaDaSemanaComArtigo(LocalDate data) {
        DayOfWeek dia = data.getDayOfWeek();
        String nome = dia.getDisplayName(TextStyle.FULL, PT_BR).replace("-feira", "");
        boolean masculino = dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY;
        return (masculino ? "no " : "na ") + nome;
    }

    public static String mesPorExtenso(int ano, int mes) {
        String nome = java.time.Month.of(mes).getDisplayName(TextStyle.FULL, PT_BR);
        return nome + " de " + ano;
    }

    // O nome da cultura no meio da frase: "Soja" vira "soja".
    public static String cultura(Cultura cultura) {
        return cultura.getNome().toLowerCase(PT_BR);
    }

    // "Embrapa — Agência de Informação Tecnológica, Soja" vira "Embrapa": o "Por quê?" cita só a instituição.
    public static String fonteCurta(String fonte) {
        if (fonte == null || fonte.isBlank()) return "Embrapa";
        String curta = fonte;
        for (String corte : new String[]{" —", " –", ",", ";", " ("}) {
            int i = curta.indexOf(corte);
            if (i > 0) curta = curta.substring(0, i);
        }
        return curta.trim();
    }

    // ---- Mensagens dos alertas (ficam gravadas) ----

    // Limite de frio de até 5 °C no ar é geada na planta (o ar a 2 m fica de 3 a 6 °C mais quente que a
    // relva); mais alto (banana, 10 °C) é friagem, e o texto não fala em geada.
    public static boolean frioEGeada(Cultura c) {
        return c.getTempCriticaBaixaC() <= 5;
    }

    public static String mensagemGeada(Cultura c, LocalDate data, double minima) {
        if (!frioEGeada(c)) {
            return "Frio de " + numero(minima) + " °C " + quandoComData(data) + ", abaixo do limite de "
                    + numero(c.getTempCriticaBaixaC()) + " °C para " + cultura(c) + ".";
        }
        return "Frio de " + numero(minima) + " °C " + quandoComData(data)
                + ". Risco de geada para " + cultura(c) + ", que sofre abaixo de "
                + numero(c.getTempCriticaBaixaC()) + " °C.";
    }

    public static String mensagemCalorForte(Cultura c, LocalDate pico, double maxima, double mediaDasMaximas) {
        return "Semana de calor forte: máximas de " + numero(mediaDasMaximas) + " °C em média, acima do limite de "
                + numero(c.getTempCriticaAltaC()) + " °C para " + cultura(c) + ". O pico é de "
                + numero(maxima) + " °C " + quandoComData(pico) + ".";
    }

    public static String mensagemSemanaFria(Cultura c, double media) {
        return "Semana mais fria que o ideal para " + cultura(c) + ": média de " + numero(media)
                + " °C, abaixo de " + numero(c.getTempMinIdealC()) + " °C.";
    }

    public static String mensagemSemanaQuente(Cultura c, double media) {
        return "Semana mais quente que o ideal para " + cultura(c) + ": média de " + numero(media)
                + " °C, acima de " + numero(c.getTempMaxIdealC()) + " °C.";
    }

    public static String mensagemChuvaDemais(Cultura c, double soma) {
        return "Chuva demais: " + numero(soma) + " mm previstos na semana. O máximo para "
                + cultura(c) + " é " + numero(c.getChuvaSemMaxMm()) + " mm.";
    }

    public static String mensagemPoucaChuva(Cultura c, double soma) {
        return "Pouca chuva: só " + numero(soma) + " mm previstos na semana. O mínimo para "
                + cultura(c) + " é " + numero(c.getChuvaSemMinMm()) + " mm.";
    }

    public static String mensagemFavoravel(Cultura c) {
        return "Tudo certo esta semana: chuva e temperatura dentro do ideal para " + cultura(c) + ".";
    }

    // ---- "Por quê?" de cada tipo, montado com a faixa da cultura e a fonte ----

    public static String porque(String tipo, Cultura c) {
        String fonte = " Fonte: " + fonteCurta(c.getFonte()) + ".";
        String ideal = "o ideal é uma média entre " + numero(c.getTempMinIdealC()) + " °C e "
                + numero(c.getTempMaxIdealC()) + " °C";
        if (CicloDaCultura.perene(c)) {
            ideal = "o ideal é uma média anual entre " + numero(c.getTempMinIdealC()) + " °C e "
                    + numero(c.getTempMaxIdealC()) + " °C";
        }
        String chuva = "precisa de " + numero(c.getChuvaSemMinMm()) + " a " + numero(c.getChuvaSemMaxMm())
                + " mm de chuva por semana";

        return switch (tipo) {
            case "geada" -> "Para " + cultura(c) + ", " + ideal + "; abaixo de "
                    + numero(c.getTempCriticaBaixaC()) + " °C a planta sofre dano pelo frio." + fonte;
            case "frio" -> "Para " + cultura(c) + ", " + ideal + ". Abaixo disso a planta cresce mais devagar." + fonte;
            case "calor" -> "Para " + cultura(c) + ", " + ideal + "; com máximas acima de "
                    + numero(c.getTempCriticaAltaC()) + " °C ao longo da semana, a planta sofre com o calor." + fonte;
            case "chuva_excessiva", "deficit_hidrico" -> "A lavoura de " + cultura(c) + " " + chuva + "." + fonte;
            default -> "Temperatura e chuva da semana dentro da faixa ideal: " + ideal.replace("o ideal é ", "")
                    + ", e " + numero(c.getChuvaSemMinMm()) + " a " + numero(c.getChuvaSemMaxMm())
                    + " mm de chuva por semana." + fonte;
        };
    }

    // ---- Aviso curto do card do painel ----

    public static String avisoCurto(String tipo, String severidade, LocalDate data, LocalDate hoje, Cultura c) {
        String quando = quandoRelativo(data, hoje);
        return switch (tipo) {
            case "geada" -> (frioEGeada(c) ? "Risco de geada " : "Frio forte ") + quando;
            case "calor" -> "critico".equals(severidade) ? "Calor forte " + quando : "Semana mais quente que o ideal";
            case "frio" -> "Semana mais fria que o ideal";
            case "chuva_excessiva" -> "Chuva demais na semana";
            case "deficit_hidrico" -> "Pouca chuva na semana";
            default -> "Tudo certo esta semana";
        };
    }

    // ---- O tempo de cada dia ----

    // weather_code da Open-Meteo (padrão WMO) para os ícones do front.
    public static String condicao(int codigo) {
        if (codigo == 0) return "sol";
        if (codigo <= 2) return "sol_nuvens";
        if (codigo == 3 || codigo == 45 || codigo == 48) return "nublado";
        if (codigo >= 95) return "tempestade";
        return "chuva";
    }

    public static String condicaoTexto(String condicao) {
        return switch (condicao) {
            case "sol" -> "céu limpo";
            case "sol_nuvens" -> "sol com poucas nuvens";
            case "nublado" -> "nublado";
            case "tempestade" -> "tempestade";
            default -> "chuva";
        };
    }
}
