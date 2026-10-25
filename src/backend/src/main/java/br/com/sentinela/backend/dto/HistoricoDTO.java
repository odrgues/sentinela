package br.com.sentinela.backend.dto;

import java.time.LocalDate;
import java.util.List;

// GET /api/cultivos/{id}/alertas: 20 por página, do mais novo para o mais antigo.
public record HistoricoDTO(List<AvisoDTO> itens, long total, int pagina, int tamanho) {

    public record AvisoDTO(String tipo, String severidade, LocalDate data, String mensagem) {}
}
