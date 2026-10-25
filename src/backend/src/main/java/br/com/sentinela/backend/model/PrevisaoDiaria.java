package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "previsao_diaria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrevisaoDiaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultivo_id", nullable = false)
    private Cultivo cultivo;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "temp_min_c", nullable = false)
    private Double tempMinC;

    @Column(name = "temp_max_c", nullable = false)
    private Double tempMaxC;

    @Column(name = "chuva_mm", nullable = false)
    private Double chuvaMm;

    // weather_code da Open-Meteo, convertido em sol, nublado, chuva... na hora de mostrar
    @Column(name = "codigo_tempo", nullable = false)
    private Integer codigoTempo;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm = LocalDateTime.now();

    public double tempMediaC() {
        return (tempMinC + tempMaxC) / 2;
    }
}
