package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.CultivoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// A rotina das 6h: previsão nova, avisos refeitos e WhatsApp para os riscos críticos.
@Service
@RequiredArgsConstructor
@Slf4j
public class AgendadorAlertasService {

    private final CultivoRepository cultivoRepository;
    private final PrevisaoService previsaoService;
    private final AlertaEngineService alertaEngineService;
    private final WhatsAppService whatsAppService;
    private final PainelService painelService;

    @Scheduled(cron = "0 0 6 * * *", zone = "America/Sao_Paulo")
    public void executarProcessamentoDiario() {
        log.info("Iniciando rotina diária do Sentinela...");

        List<Cultivo> cultivosAtivos = cultivoRepository.findByStatus("em_andamento");
        for (Cultivo cultivo : cultivosAtivos) {
            processarCultivo(cultivo);
        }

        if (Agora.hoje().getDayOfWeek() == DayOfWeek.MONDAY) {
            enviarResumosDaSemana(cultivosAtivos);
        }

        log.info("Rotina diária concluída. Cultivos processados: {}", cultivosAtivos.size());
    }

    // Também roda ao salvar ou editar uma lavoura, para o painel não abrir vazio.
    // Se a Open-Meteo falhar, refaz os avisos com a última previsão salva.
    public void processarCultivo(Cultivo cultivo) {
        try {
            previsaoService.atualizar(cultivo);
            List<Alerta> novosCriticos = alertaEngineService.reclassificar(cultivo);
            novosCriticos.forEach(whatsAppService::notificarAlertaSeHabilitado);
        } catch (Exception e) {
            log.error("Falha ao processar o cultivo {} ({}): {}", cultivo.getId(), cultivo.getApelido(), e.getMessage());
        }
    }

    private void enviarResumosDaSemana(List<Cultivo> cultivosAtivos) {
        Map<Long, Usuario> donos = cultivosAtivos.stream()
                .map(Cultivo::getUsuario)
                .collect(Collectors.toMap(Usuario::getId, u -> u, (a, b) -> a, LinkedHashMap::new));
        for (Usuario usuario : donos.values()) {
            try {
                whatsAppService.enviarResumoDaSemana(usuario, painelService.fraseDaSemana(usuario));
            } catch (Exception e) {
                log.error("Falha no resumo da semana do usuário {}: {}", usuario.getId(), e.getMessage());
            }
        }
    }
}
