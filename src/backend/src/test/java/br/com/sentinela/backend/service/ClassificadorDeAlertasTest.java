package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.DiaPrevistoDTO;
import br.com.sentinela.backend.model.Cultura;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ClassificadorDeAlertasTest {

    private static final LocalDate SEGUNDA = LocalDate.of(2026, 10, 26);

    // Soja: ideal 20–30 °C (média), crítica 10 e 35 °C, chuva 26,5–47,1 mm por semana.
    private static Cultura soja() {
        Cultura soja = new Cultura();
        soja.setId(3L);
        soja.setNome("Soja");
        soja.setTipoCiclo("anual");
        soja.setCicloDias(120);
        soja.setTempMinIdealC(20.0);
        soja.setTempMaxIdealC(30.0);
        soja.setTempCriticaBaixaC(10.0);
        soja.setTempCriticaAltaC(35.0);
        soja.setChuvaSemMinMm(26.5);
        soja.setChuvaSemMaxMm(47.1);
        soja.setFonte("Embrapa — Agência de Informação Tecnológica, Soja");
        return soja;
    }

    private static List<DiaPrevistoDTO> semana(double min, double max, double chuvaPorDia) {
        List<DiaPrevistoDTO> dias = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            dias.add(new DiaPrevistoDTO(SEGUNDA.plusDays(i), min, max, chuvaPorDia, 1));
        }
        return dias;
    }

    @Test
    void semanaDentroDoIdealDaUmAvisoFavoravel() {
        var alertas = ClassificadorDeAlertas.classificar(soja(), semana(19, 31, 5));

        assertThat(alertas).singleElement().satisfies(a -> {
            assertThat(a.tipo()).isEqualTo("favoravel");
            assertThat(a.severidade()).isEqualTo("info");
            assertThat(a.data()).isEqualTo(SEGUNDA);
        });
    }

    @Test
    void umDiaQuenteSozinhoNaoECritico() {
        List<DiaPrevistoDTO> dias = semana(19, 31, 5);
        dias.set(3, new DiaPrevistoDTO(SEGUNDA.plusDays(3), 22, 36.2, 0, 0));

        var alertas = ClassificadorDeAlertas.classificar(soja(), dias);

        assertThat(alertas).extracting(ClassificadorDeAlertas.NovoAlerta::severidade).doesNotContain("critico");
        assertThat(ClassificadorDeAlertas.nivelDoDia(soja(), dias.get(3), false))
                .isEqualTo(new ClassificadorDeAlertas.NivelDoDia("atencao", "Calor acima do limite"));
    }

    @Test
    void semanaComMediaDasMaximasAcimaDoLimiteECritica() {
        double[] maximas = {34, 35, 36, 37, 36, 35, 33};
        List<DiaPrevistoDTO> dias = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            dias.add(new DiaPrevistoDTO(SEGUNDA.plusDays(i), 21, maximas[i], 3, 0));
        }

        var alertas = ClassificadorDeAlertas.classificar(soja(), dias);

        assertThat(alertas).filteredOn(a -> a.severidade().equals("critico")).singleElement().satisfies(a -> {
            assertThat(a.tipo()).isEqualTo("calor");
            assertThat(a.data()).isEqualTo(SEGUNDA.plusDays(3));
            assertThat(a.mensagem()).isEqualTo("Semana de calor forte: máximas de 35,1 °C em média, acima do limite "
                    + "de 35 °C para soja. O pico é de 37 °C na quinta (29/10).");
        });
        assertThat(ClassificadorDeAlertas.nivelDoDia(soja(), dias.get(3), true).nivel()).isEqualTo("critico");
    }

    @Test
    void minimaAbaixoDoLimiteViraGeadaCritica() {
        List<DiaPrevistoDTO> dias = semana(19, 31, 5);
        dias.set(1, new DiaPrevistoDTO(SEGUNDA.plusDays(1), 9, 25, 0, 0));

        var alertas = ClassificadorDeAlertas.classificar(soja(), dias);

        assertThat(alertas).extracting(ClassificadorDeAlertas.NovoAlerta::tipo).contains("geada");
        assertThat(alertas).filteredOn(a -> a.tipo().equals("geada"))
                .singleElement()
                .satisfies(a -> assertThat(a.severidade()).isEqualTo("critico"));
    }

    @Test
    void chuvaDaSemanaForaDaFaixaDaAtencao() {
        var muitaChuva = ClassificadorDeAlertas.classificar(soja(), semana(19, 31, 10));
        var poucaChuva = ClassificadorDeAlertas.classificar(soja(), semana(19, 31, 0));

        assertThat(muitaChuva).extracting(ClassificadorDeAlertas.NovoAlerta::tipo).containsExactly("chuva_excessiva");
        assertThat(poucaChuva).extracting(ClassificadorDeAlertas.NovoAlerta::tipo).containsExactly("deficit_hidrico");
        assertThat(poucaChuva.get(0).severidade()).isEqualTo("atencao");
    }

    @Test
    void mediaDaSemanaAcimaDoIdealDaAtencaoDeCalor() {
        var alertas = ClassificadorDeAlertas.classificar(soja(), semana(26, 35, 5));

        assertThat(alertas).singleElement().satisfies(a -> {
            assertThat(a.tipo()).isEqualTo("calor");
            assertThat(a.severidade()).isEqualTo("atencao");
        });
    }

    @Test
    void naPereneAFaixaIdealNaoGeraAviso() {
        Cultura cafe = soja();
        cafe.setNome("Café");
        cafe.setTipoCiclo("perene");
        cafe.setTempMinIdealC(18.0);
        cafe.setTempMaxIdealC(22.0);
        cafe.setTempCriticaBaixaC(1.0);
        cafe.setTempCriticaAltaC(34.0);

        // Média de 27 °C: fora do ideal anual do café, mas sem passar dos limites críticos.
        var alertas = ClassificadorDeAlertas.classificar(cafe, semana(21, 33, 5));

        assertThat(alertas).extracting(ClassificadorDeAlertas.NovoAlerta::tipo).containsExactly("favoravel");
    }

    @Test
    void nivelDoDiaSegueOsLimites() {
        Cultura soja = soja();
        assertThat(ClassificadorDeAlertas.nivelDoDia(soja, new DiaPrevistoDTO(SEGUNDA, 9, 25, 0, 0), false).nivel())
                .isEqualTo("critico");
        assertThat(ClassificadorDeAlertas.nivelDoDia(soja, new DiaPrevistoDTO(SEGUNDA, 26, 35, 0, 0), false).nivel())
                .isEqualTo("atencao");
        assertThat(ClassificadorDeAlertas.nivelDoDia(soja, new DiaPrevistoDTO(SEGUNDA, 19, 31, 0, 0), false))
                .isEqualTo(new ClassificadorDeAlertas.NivelDoDia("ok", "Dentro do ideal"));
    }
}
