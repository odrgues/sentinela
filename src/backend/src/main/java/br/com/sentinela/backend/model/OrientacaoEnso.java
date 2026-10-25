package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// O que uma fase do El Niño / La Niña costuma trazer para a região e o que fazer.
// Sem cultura, vale para todas.
@Entity
@Table(name = "orientacao_enso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrientacaoEnso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String fase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultura_id")
    private Cultura cultura;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String efeito;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(nullable = false, length = 300)
    private String fonte;
}
