package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultivo_id", nullable = false)
    private Cultivo cultivo;

    @Column(nullable = false, length = 25)
    private String tipo;

    @Column(nullable = false, length = 10)
    private String severidade;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "data_prevista", nullable = false)
    private LocalDate dataPrevista;

    @Column(name = "gerado_em", nullable = false, updatable = false)
    private LocalDateTime geradoEm = LocalDateTime.now();
}