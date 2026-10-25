package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cultivo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cultivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "municipio_id", nullable = false)
    private Municipio municipio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultura_id", nullable = false)
    private Cultura cultura;

    @Column(nullable = false, length = 80)
    private String apelido;

    @Column(name = "area_ha", precision = 10, scale = 4)
    private BigDecimal areaHa;

    // O ponto exato marcado no mapa. A previsão usa sempre este ponto, nunca o do município.
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "data_plantio", nullable = false)
    private LocalDate dataPlantio;

    @Column(name = "data_colheita_prevista", nullable = false)
    private LocalDate dataColheitaPrevista;

    @Column(nullable = false, length = 20)
    private String status = "em_andamento";

    @Column(name = "previsao_disponivel", nullable = false)
    private Boolean previsaoDisponivel = false;

    @Column(name = "previsao_atualizada_em")
    private LocalDateTime previsaoAtualizadaEm;
}
