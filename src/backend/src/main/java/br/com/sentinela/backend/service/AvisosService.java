package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.repository.AlertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

// Os avisos da semana de um cultivo, do mais grave para o mais leve.
@Service
@RequiredArgsConstructor
public class AvisosService {

    private static final Map<String, Integer> PESO = Map.of("critico", 3, "atencao", 2, "info", 1);

    public static final Comparator<Alerta> MAIS_GRAVE_PRIMEIRO = Comparator
            .comparing((Alerta a) -> -peso(a.getSeveridade()))
            .thenComparing(Alerta::getDataPrevista);

    private final AlertaRepository alertaRepository;

    // A semana começa no dia da última previsão que deu certo: se a Open-Meteo falhar hoje,
    // os avisos de ontem continuam aparecendo em vez de a lavoura parecer "tudo certo".
    public List<Alerta> daSemana(Cultivo cultivo) {
        LocalDate hoje = Agora.hoje();
        LocalDate inicio = cultivo.getPrevisaoAtualizadaEm() == null
                ? hoje
                : min(cultivo.getPrevisaoAtualizadaEm().toLocalDate(), hoje);
        return alertaRepository.findByCultivoIdAndDataPrevistaBetween(cultivo.getId(), inicio, hoje.plusDays(6))
                .stream()
                .sorted(MAIS_GRAVE_PRIMEIRO)
                .toList();
    }

    public static int peso(String severidade) {
        return PESO.getOrDefault(severidade, 0);
    }

    private static LocalDate min(LocalDate a, LocalDate b) {
        return a.isBefore(b) ? a : b;
    }
}
