package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.DiaPrevistoDTO;
import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.repository.AlertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertaEngineService {

    private final AlertaRepository alertaRepository;
    private final PrevisaoService previsaoService;

    // Refaz os avisos de hoje em diante com a previsão salva. Devolve só os críticos que não
    // existiam antes, para o WhatsApp não repetir o mesmo aviso todo dia.
    @Transactional
    public List<Alerta> reclassificar(Cultivo cultivo) {
        List<DiaPrevistoDTO> dias = previsaoService.semana(cultivo.getId());
        if (dias.isEmpty()) return List.of();

        LocalDate hoje = Agora.hoje();
        Set<String> jaAvisados = alertaRepository.findByCultivoIdAndDataPrevistaBetween(cultivo.getId(), hoje, hoje.plusDays(6))
                .stream()
                .map(a -> a.getTipo() + "|" + a.getSeveridade() + "|" + a.getDataPrevista())
                .collect(Collectors.toSet());

        alertaRepository.apagarAPartirDe(cultivo.getId(), hoje);
        alertaRepository.flush();

        List<Alerta> salvos = ClassificadorDeAlertas.classificar(cultivo.getCultura(), dias).stream()
                .map(novo -> {
                    Alerta alerta = new Alerta();
                    alerta.setCultivo(cultivo);
                    alerta.setTipo(novo.tipo());
                    alerta.setSeveridade(novo.severidade());
                    alerta.setMensagem(novo.mensagem());
                    alerta.setDataPrevista(novo.data());
                    alerta.setGeradoEm(Agora.agora());
                    return alertaRepository.save(alerta);
                })
                .toList();

        return salvos.stream()
                .filter(a -> "critico".equals(a.getSeveridade()))
                .filter(a -> !jaAvisados.contains(a.getTipo() + "|" + a.getSeveridade() + "|" + a.getDataPrevista()))
                .toList();
    }
}
