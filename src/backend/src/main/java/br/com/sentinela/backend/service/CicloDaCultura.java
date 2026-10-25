package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Cultura;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

// As regras de cada tipo de ciclo:
// - anual (soja, milho...): colhe no fim do ciclo;
// - cana: ano e meio se plantada de janeiro a março, senão 12 meses;
// - continua (morango, chuchu): começa a colher no meio do ciclo e colhe até o fim;
// - perene (café, banana, goiaba): produz por anos. Com meses de colheita (café), tem safra.
public final class CicloDaCultura {

    public static final String ANUAL = "anual";
    public static final String CANA = "cana";
    public static final String PERENE = "perene";
    public static final String CONTINUA = "continua";

    private CicloDaCultura() {}

    public static boolean perene(Cultura cultura) {
        return PERENE.equals(cultura.getTipoCiclo());
    }

    private static boolean temSafra(Cultura cultura) {
        return perene(cultura) && cultura.getMesInicioColheita() != null;
    }

    // Anual: plantio + ciclo. Contínua: quando a colheita começa.
    // Perene com safra: o próximo 1º dia do mês de colheita. Perene sem safra: a primeira colheita.
    public static LocalDate colheitaPrevista(Cultura cultura, LocalDate plantio, LocalDate hoje) {
        return switch (cultura.getTipoCiclo()) {
            case CANA -> plantio.plusDays(plantio.getMonthValue() <= 3 ? 540 : 365);
            case CONTINUA -> plantio.plusDays(cultura.getInicioColheitaDias());
            case PERENE -> {
                if (!temSafra(cultura)) yield plantio.plusDays(cultura.getCicloDias());
                LocalDate inicio = LocalDate.of(hoje.getYear(), cultura.getMesInicioColheita(), 1);
                yield hoje.isBefore(inicio) ? inicio : inicio.plusYears(1);
            }
            default -> plantio.plusDays(cultura.getCicloDias());
        };
    }

    // Nulo na perene, que não tem "Dia X de Y".
    public static Integer cicloDias(Cultura cultura, LocalDate plantio, LocalDate colheitaPrevista) {
        return switch (cultura.getTipoCiclo()) {
            case PERENE -> null;
            case CONTINUA -> cultura.getCicloDias();
            default -> (int) ChronoUnit.DAYS.between(plantio, colheitaPrevista);
        };
    }

    // Dias desde o plantio, de 0 (plantou hoje ou vai plantar) até o fim do ciclo.
    public static Integer diaAtual(Cultura cultura, LocalDate plantio, LocalDate colheitaPrevista, LocalDate hoje) {
        Integer ciclo = cicloDias(cultura, plantio, colheitaPrevista);
        if (ciclo == null) return null;
        long dias = ChronoUnit.DAYS.between(plantio, hoje);
        return (int) Math.max(0, Math.min(dias, ciclo));
    }

    // Café com colheita em maio de 2027: "2026/27". Só na perene com meses de colheita.
    public static String safra(Cultura cultura, LocalDate colheitaPrevista) {
        if (!temSafra(cultura)) return null;
        int ano = colheitaPrevista.getYear();
        return String.format("%d/%02d", ano - 1, ano % 100);
    }

    // A linha embaixo do nome da cultura na lista de "O que você plantou?".
    public static String descricao(Cultura cultura) {
        return switch (cultura.getTipoCiclo()) {
            case CANA -> "Ciclo de 12 ou 18 meses";
            case CONTINUA -> "Colhe a partir de " + cultura.getInicioColheitaDias() + " dias, por "
                    + Math.round((cultura.getCicloDias() - cultura.getInicioColheitaDias()) / 30.0) + " meses";
            case PERENE -> temSafra(cultura)
                    ? "Perene · colheita de " + mes(cultura.getMesInicioColheita()) + " a " + mes(cultura.getMesFimColheita())
                    : "Perene · primeira colheita em cerca de " + Math.round(cultura.getCicloDias() / 30.0) + " meses";
            default -> "Ciclo de " + cultura.getCicloDias() + " dias";
        };
    }

    // A frase embaixo do ciclo no detalhe das perenes com safra.
    public static String explicacao(Cultura cultura) {
        if (!temSafra(cultura) || cultura.getMesFimColheita() == null) return null;
        return "A colheita vai de " + mes(cultura.getMesInicioColheita()) + " a " + mes(cultura.getMesFimColheita()) + ".";
    }

    private static String mes(Integer mes) {
        return mes == null ? "" : java.time.Month.of(mes)
                .getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.of("pt", "BR"));
    }
}
