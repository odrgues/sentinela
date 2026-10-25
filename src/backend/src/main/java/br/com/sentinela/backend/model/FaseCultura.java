package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Uma fase do ciclo (germinação, floração...), em dias desde o plantio, com o que fazer nela.
@Entity
@Table(name = "fase_cultura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FaseCultura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultura_id", nullable = false)
    private Cultura cultura;

    @Column(nullable = false, length = 60)
    private String nome;

    @Column(name = "dia_inicio", nullable = false)
    private Integer diaInicio;

    @Column(name = "dia_fim", nullable = false)
    private Integer diaFim;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String orientacao;

    @Column(nullable = false, length = 300)
    private String fonte;
}
