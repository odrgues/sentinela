package br.com.sentinela.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "chat_id", nullable = false, length = 32)
    private String chatId;

    @Column(nullable = false, length = 10)
    private String direcao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(length = 30)
    private String intencao;

    @Column(name = "registrado_em", nullable = false, updatable = false)
    private LocalDateTime registradoEm = LocalDateTime.now();
}