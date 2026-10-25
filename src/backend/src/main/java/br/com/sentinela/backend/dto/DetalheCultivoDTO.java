package br.com.sentinela.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

// GET /api/cultivos/{id}: ciclo, El Niño/La Niña, fase, avisos da semana e previsão de 7 dias.
public record DetalheCultivoDTO(
        Long id,
        String apelido,
        String cultura,
        Long culturaId,
        Double areaHa,
        String municipio,
        Double latitude,
        Double longitude,
        String status,
        String tipoCiclo,
        LocalDate dataPlantio,
        LocalDate colheitaPrevista,
        Integer diaAtual,
        Integer cicloDias,
        String safra,
        String explicacaoCiclo,
        boolean previsaoDisponivel,
        OffsetDateTime previsaoAtualizadaEm,
        EnsoDTO enso,
        FaseDTO fase,
        List<AlertaDaSemanaDTO> alertas,
        List<DiaDaPrevisaoDTO> previsao
) {
    // efeito e oQueFazer vêm da tabela orientacao_enso (nulos se a fase não tiver orientação com fonte).
    public record EnsoDTO(String fase, String intensidade, BigDecimal indice, String mesPlantio, String frase,
                          String efeito, String oQueFazer, String fonte) {}

    // A fase do ciclo em que a lavoura está e o que ela pede.
    public record FaseDTO(String nome, int diaInicio, int diaFim, String orientacao, String fonte) {}

    public record AlertaDaSemanaDTO(String tipo, String severidade, LocalDate data, String mensagem,
                                    String porque, String oQueFazer) {}

    public record DiaDaPrevisaoDTO(LocalDate data, String condicao, long minC, long maxC, double chuvaMm,
                                   String nivel, String frase) {}
}
