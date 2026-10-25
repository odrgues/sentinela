package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cultura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cultura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Column(name = "tipo_ciclo", nullable = false, length = 10)
    private String tipoCiclo = "anual"; // 'anual', 'cana', 'perene', 'continua'

    // Anual: até a colheita. Contínua: até o fim da colheita. Perene: até a primeira colheita.
    @Column(name = "ciclo_dias", nullable = false)
    private Integer cicloDias;

    // Só na colheita contínua (morango, chuchu): quando a colheita começa.
    @Column(name = "inicio_colheita_dias")
    private Integer inicioColheitaDias;

    // Só na perene com safra (café): de que mês a que mês vai a colheita.
    @Column(name = "mes_inicio_colheita")
    private Integer mesInicioColheita;

    @Column(name = "mes_fim_colheita")
    private Integer mesFimColheita;

    @Column(name = "temp_min_ideal_c")
    private Double tempMinIdealC;

    @Column(name = "temp_max_ideal_c")
    private Double tempMaxIdealC;

    @Column(name = "temp_critica_baixa_c")
    private Double tempCriticaBaixaC;

    @Column(name = "temp_critica_alta_c")
    private Double tempCriticaAltaC;

    @Column(name = "chuva_sem_min_mm")
    private Double chuvaSemMinMm;

    @Column(name = "chuva_sem_max_mm")
    private Double chuvaSemMaxMm;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fonte;

    @Column(columnDefinition = "TEXT")
    private String observacao;
}