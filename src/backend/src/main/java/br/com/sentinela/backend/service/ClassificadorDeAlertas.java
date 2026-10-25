package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.DiaPrevistoDTO;
import br.com.sentinela.backend.model.Cultura;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

// Compara os 7 dias de previsão com as faixas da cultura (seção "Como o backend classifica").
// O frio crítico vale para cada dia: uma noite de geada já estraga. O calor crítico vale para a
// média das máximas da semana, como as fontes (Epagri, IAC) usam o limite: um dia quente isolado
// não basta. A faixa ideal e a chuva também são da semana inteira.
public final class ClassificadorDeAlertas {

    public record NovoAlerta(String tipo, String severidade, LocalDate data, String mensagem) {}

    public record NivelDoDia(String nivel, String frase) {}

    private ClassificadorDeAlertas() {}

    public static List<NovoAlerta> classificar(Cultura cultura, List<DiaPrevistoDTO> dias) {
        List<NovoAlerta> alertas = new ArrayList<>();
        if (dias.isEmpty()) return alertas;

        for (DiaPrevistoDTO dia : dias) {
            if (dia.tempMinC() < cultura.getTempCriticaBaixaC()) {
                alertas.add(new NovoAlerta("geada", "critico", dia.data(),
                        Textos.mensagemGeada(cultura, dia.data(), dia.tempMinC())));
            }
        }

        // O calor forte fica com a data do dia mais quente, que é o que a mensagem cita.
        if (semanaDeCalorForte(cultura, dias)) {
            DiaPrevistoDTO pico = dias.stream().max(Comparator.comparingDouble(DiaPrevistoDTO::tempMaxC)).orElseThrow();
            alertas.add(new NovoAlerta("calor", "critico", pico.data(),
                    Textos.mensagemCalorForte(cultura, pico.data(), pico.tempMaxC(), mediaDasMaximas(dias))));
        }

        // Os avisos da semana ficam com a data do primeiro dia da previsão.
        LocalDate inicio = dias.get(0).data();
        double media = dias.stream().mapToDouble(DiaPrevistoDTO::tempMediaC).average().orElse(0);
        double chuva = dias.stream().mapToDouble(DiaPrevistoDTO::chuvaMm).sum();

        // Na perene, a faixa ideal é média anual: só os limites críticos geram aviso de temperatura.
        if (!CicloDaCultura.perene(cultura)) {
            if (media < cultura.getTempMinIdealC()) {
                alertas.add(new NovoAlerta("frio", "atencao", inicio, Textos.mensagemSemanaFria(cultura, media)));
            } else if (media > cultura.getTempMaxIdealC() && !temAlerta(alertas, "calor", inicio)) {
                alertas.add(new NovoAlerta("calor", "atencao", inicio, Textos.mensagemSemanaQuente(cultura, media)));
            }
        }

        if (chuva > cultura.getChuvaSemMaxMm()) {
            alertas.add(new NovoAlerta("chuva_excessiva", "atencao", inicio, Textos.mensagemChuvaDemais(cultura, chuva)));
        } else if (chuva < cultura.getChuvaSemMinMm()) {
            alertas.add(new NovoAlerta("deficit_hidrico", "atencao", inicio, Textos.mensagemPoucaChuva(cultura, chuva)));
        }

        if (alertas.isEmpty()) {
            alertas.add(new NovoAlerta("favoravel", "info", inicio, Textos.mensagemFavoravel(cultura)));
        }
        return alertas;
    }

    // critico se a mínima ou a máxima passa de um limite crítico; atencao se a média do dia
    // fica fora da faixa ideal (menos na perene); ok nos outros casos.
    // O dia acima do limite de calor só fica crítico se a semana toda for de calor forte;
    // sozinho, é atenção.
    public static NivelDoDia nivelDoDia(Cultura cultura, DiaPrevistoDTO dia, boolean semanaDeCalorForte) {
        if (dia.tempMinC() < cultura.getTempCriticaBaixaC()) {
            return new NivelDoDia("critico", Textos.frioEGeada(cultura) ? "Frio forte: risco de geada" : "Frio forte: risco");
        }
        if (dia.tempMaxC() > cultura.getTempCriticaAltaC()) {
            return semanaDeCalorForte
                    ? new NivelDoDia("critico", "Calor forte: risco")
                    : new NivelDoDia("atencao", "Calor acima do limite");
        }
        if (!CicloDaCultura.perene(cultura)) {
            if (dia.tempMediaC() > cultura.getTempMaxIdealC()) return new NivelDoDia("atencao", "Mais quente que o ideal");
            if (dia.tempMediaC() < cultura.getTempMinIdealC()) return new NivelDoDia("atencao", "Mais frio que o ideal");
        }
        if (dia.chuvaMm() >= 10) return new NivelDoDia("ok", "Dentro do ideal, com chuva");
        return new NivelDoDia("ok", "Dentro do ideal");
    }

    public static boolean semanaDeCalorForte(Cultura cultura, List<DiaPrevistoDTO> dias) {
        return !dias.isEmpty() && mediaDasMaximas(dias) > cultura.getTempCriticaAltaC();
    }

    private static double mediaDasMaximas(List<DiaPrevistoDTO> dias) {
        return dias.stream().mapToDouble(DiaPrevistoDTO::tempMaxC).average().orElse(0);
    }

    private static boolean temAlerta(List<NovoAlerta> alertas, String tipo, LocalDate data) {
        return alertas.stream().anyMatch(a -> a.tipo().equals(tipo) && a.data().equals(data));
    }
}
