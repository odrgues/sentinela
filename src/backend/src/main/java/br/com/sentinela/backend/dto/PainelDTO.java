package br.com.sentinela.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;

// GET /api/painel: o dashboard inteiro numa chamada só.
public record PainelDTO(
        UsuarioDoPainel usuario,
        Hoje hoje,
        String frase,
        boolean previsaoDisponivel,
        OffsetDateTime previsaoAtualizadaEm,
        List<LavouraDoPainel> cultivos
) {
    public record UsuarioDoPainel(String nome) {}

    public record Hoje(String cidade, String uf, Long tempC, String condicao, String condicaoTexto) {}

    public record Aviso(String tipo, String severidade, String mensagem) {}

    public record LavouraDoPainel(Long id, String apelido, String cultura, String tipoCiclo, Integer diaAtual,
                                  Integer cicloDias, String safra, Double latitude, Double longitude,
                                  String fase, Aviso aviso) {}
}
