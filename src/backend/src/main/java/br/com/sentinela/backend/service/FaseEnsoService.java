package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.DetalheCultivoDTO;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.FaseEnso;
import br.com.sentinela.backend.repository.FaseEnsoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FaseEnsoService {

    private final FaseEnsoRepository faseEnsoRepository;

    public FaseEnso buscarFaseAtual() {
        LocalDate hoje = Agora.hoje();
        int anoAtual = hoje.getYear();
        int mesAtual = hoje.getMonthValue();

        return faseEnsoRepository.findByAnoAndMes(anoAtual, mesAtual)
                .orElseGet(() -> faseEnsoRepository.findFirstByOrderByAnoDescMesDesc()
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhum registro do fenômeno ENSO encontrado no banco.")));
    }

    public List<FaseEnso> listarHistorico() {
        return faseEnsoRepository.findAllByOrderByAnoDescMesDesc();
    }

    // Anual e cana: o mês do plantio. Perene: o último mês medido pela NOAA, porque o plantio
    // de um cafezal antigo não diz nada sobre a safra atual. A NOAA publica com 1 a 2 meses de
    // atraso: plantio recente, ainda sem medição, também usa o último mês medido.
    // Plantio antes do começo da série: nulo (o front esconde o cartão).
    public DetalheCultivoDTO.EnsoDTO ensoDoCultivo(Cultivo cultivo) {
        boolean perene = CicloDaCultura.perene(cultivo.getCultura());
        LocalDate plantio = cultivo.getDataPlantio();
        Optional<FaseEnso> ultimo = faseEnsoRepository.findFirstByOrderByAnoDescMesDesc();

        if (perene) {
            return ultimo.map(fase -> paraDto(fase, fraseUltimoMes(fase))).orElse(null);
        }

        Optional<FaseEnso> doPlantio = faseEnsoRepository.findByAnoAndMes(plantio.getYear(), plantio.getMonthValue());
        if (doPlantio.isPresent()) {
            return paraDto(doPlantio.get(), fraseDoPlantio(doPlantio.get()));
        }
        return ultimo
                .filter(fase -> LocalDate.of(fase.getAno(), fase.getMes(), 1).isBefore(plantio))
                .map(fase -> paraDto(fase, "Você plantou em " + Textos.mesPorExtenso(plantio.getYear(), plantio.getMonthValue())
                        + ", e a NOAA ainda não publicou esse mês. " + fraseUltimoMes(fase)))
                .orElse(null);
    }

    private static DetalheCultivoDTO.EnsoDTO paraDto(FaseEnso fase, String frase) {
        return new DetalheCultivoDTO.EnsoDTO(
                fase.getFase(),
                fase.getIntensidade(),
                fase.getIndice(),
                String.format("%d-%02d", fase.getAno(), fase.getMes()),
                frase
        );
    }

    private static String fraseDoPlantio(FaseEnso fase) {
        String quando = Textos.mesPorExtenso(fase.getAno(), fase.getMes());
        String nome = nome(fase);
        if (nome == null) {
            return "Você plantou em " + quando + ", num período neutro: sem El Niño nem La Niña.";
        }
        return "Você plantou em " + quando + ", durante " + nome + "." + CONSELHO;
    }

    private static String fraseUltimoMes(FaseEnso fase) {
        String quando = Textos.mesPorExtenso(fase.getAno(), fase.getMes());
        String nome = nome(fase);
        if (nome == null) {
            return "Em " + quando + ", último mês medido, o Pacífico estava neutro: sem El Niño nem La Niña.";
        }
        return "Em " + quando + ", último mês medido, o Pacífico estava em " + nome + "." + CONSELHO;
    }

    private static final String CONSELHO =
            " Em anos assim, o tempo pode fugir do normal da região: vale acompanhar os avisos de perto.";

    private static String nome(FaseEnso fase) {
        return switch (fase.getFase()) {
            case "El Nino" -> "um El Niño " + fase.getIntensidade();
            case "La Nina" -> "uma La Niña " + fase.getIntensidade();
            default -> null;
        };
    }
}
