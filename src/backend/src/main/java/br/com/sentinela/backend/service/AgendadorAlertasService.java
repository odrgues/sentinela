package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.repository.CultivoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AgendadorAlertasService {

    private final CultivoRepository cultivoRepository;
    private final AlertaEngineService alertaEngineService;

    @Scheduled(cron = "0 0 6 * * *", zone = "America/Sao_Paulo")
    public void executarProcessamentoDiario() {
        log.info("Iniciando rotina automática do Motor de Alertas Agroclimáticos...");

        List<Cultivo> cultivosAtivos = cultivoRepository.findByStatus("em_andamento");

        for (Cultivo cultivo : cultivosAtivos) {
            try {
                alertaEngineService.processarAlertasParaCultivo(cultivo.getId());
                log.info("Alertas atualizados para o cultivo ID: {} ({})", cultivo.getId(), cultivo.getApelido());
            } catch (Exception e) {
                log.error("Falha ao processar alertas do cultivo ID {}: {}", cultivo.getId(), e.getMessage());
            }
        }

        log.info("Varredura diária de alertas concluída. Total de cultivos processados: {}", cultivosAtivos.size());
    }
}