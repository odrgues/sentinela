package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    @Column(nullable = false, length = 100)
    private String apelido;

    @Column(name = "area_ha", nullable = false, precision = 10, scale = 2)
    private BigDecimal areaHa;

    @Column(name = "data_plantio", nullable = false)
    private LocalDate dataPlantio;

    @Column(name = "data_colheita_prevista")
    private LocalDate dataColheitaPrevista;

    @Column(nullable = false, length = 20)
    private String status = "em_andamento";
}