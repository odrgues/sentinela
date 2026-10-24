package br.com.sentinela.backend.repository;

import br.com.sentinela.backend.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByCultivoUsuarioIdOrderByDataPrevistaDesc(Long usuarioId);

    List<Alerta> findByCultivoIdOrderByDataPrevistaDesc(Long cultivoId);

    boolean existsByCultivoIdAndTipoAndDataPrevista(Long cultivoId, String tipo, LocalDate dataPrevista);
}