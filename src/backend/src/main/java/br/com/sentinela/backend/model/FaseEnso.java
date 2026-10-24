package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "fase_enso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FaseEnso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false, length = 10)
    private String fase;

    @Column(length = 15)
    private String intensidade;
    @Column(precision = 4, scale = 2)
    private BigDecimal indice;
}