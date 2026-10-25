package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Alerta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByCultivoUsuarioIdOrderByDataPrevistaDesc(Long usuarioId);
    List<Alerta> findByCultivoIdOrderByDataPrevistaDesc(Long cultivoId);
    boolean existsByCultivoIdAndTipoAndDataPrevista(Long cultivoId, String tipo, LocalDate dataPrevista);

    // Os avisos de uma janela de dias (a semana da previsão).
    List<Alerta> findByCultivoIdAndDataPrevistaBetween(Long cultivoId, LocalDate de, LocalDate ate);

    // Antes de reclassificar, os avisos de hoje em diante saem: a previsão nova manda.
    @Modifying
    @Query("delete from Alerta a where a.cultivo.id = :cultivoId and a.dataPrevista >= :de")
    void apagarAPartirDe(@Param("cultivoId") Long cultivoId, @Param("de") LocalDate de);

    // Histórico com filtros opcionais: o filtro nulo não restringe nada.
    @Query("""
            select a from Alerta a
            where a.cultivo.id = :cultivoId
              and (:severidade is null or a.severidade = :severidade)
              and (:tipo is null or a.tipo = :tipo)
              and (:de is null or a.dataPrevista >= :de)
              and (:ate is null or a.dataPrevista <= :ate)
            order by a.dataPrevista desc, a.id desc
            """)
    Page<Alerta> buscarHistorico(@Param("cultivoId") Long cultivoId,
                                 @Param("severidade") String severidade,
                                 @Param("tipo") String tipo,
                                 @Param("de") LocalDate de,
                                 @Param("ate") LocalDate ate,
                                 Pageable pagina);
}
