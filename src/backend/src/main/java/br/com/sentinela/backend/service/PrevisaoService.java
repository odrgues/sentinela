package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.DiaPrevistoDTO;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.PrevisaoDiaria;
import br.com.sentinela.backend.repository.CultivoRepository;
import br.com.sentinela.backend.repository.PrevisaoDiariaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Guarda a previsão de cada cultivo. O painel e o detalhe leem daqui, nunca da Open-Meteo na hora.
@Service
@RequiredArgsConstructor
@Slf4j
public class PrevisaoService {

    private final ClimaService climaService;
    private final PrevisaoDiariaRepository previsaoDiariaRepository;
    private final CultivoRepository cultivoRepository;

    // Busca os 7 dias pelo ponto do cultivo. Se a Open-Meteo falhar, marca a previsão como
    // indisponível e mantém o que já estava salvo.
    @Transactional
    public boolean atualizar(Cultivo cultivo) {
        List<DiaPrevistoDTO> dias;
        try {
            dias = climaService.buscarSeteDias(cultivo.getLatitude(), cultivo.getLongitude());
        } catch (Exception e) {
            log.warn("Previsão indisponível para o cultivo {}: {}", cultivo.getId(), e.getMessage());
            cultivo.setPrevisaoDisponivel(false);
            cultivoRepository.save(cultivo);
            return false;
        }

        LocalDateTime agora = Agora.agora();
        for (DiaPrevistoDTO dia : dias) {
            PrevisaoDiaria previsao = previsaoDiariaRepository.findByCultivoIdAndData(cultivo.getId(), dia.data())
                    .orElseGet(PrevisaoDiaria::new);
            previsao.setCultivo(cultivo);
            previsao.setData(dia.data());
            previsao.setTempMinC(umaCasa(dia.tempMinC()));
            previsao.setTempMaxC(umaCasa(dia.tempMaxC()));
            previsao.setChuvaMm(umaCasa(dia.chuvaMm()));
            previsao.setCodigoTempo(dia.codigoTempo());
            previsao.setAtualizadoEm(agora);
            previsaoDiariaRepository.save(previsao);
        }

        cultivo.setPrevisaoDisponivel(true);
        cultivo.setPrevisaoAtualizadaEm(agora);
        cultivoRepository.save(cultivo);
        return true;
    }

    // Os dias salvos de hoje até hoje + 6.
    @Transactional(readOnly = true)
    public List<DiaPrevistoDTO> semana(Long cultivoId) {
        LocalDate hoje = Agora.hoje();
        return previsaoDiariaRepository.findByCultivoIdAndDataBetweenOrderByDataAsc(cultivoId, hoje, hoje.plusDays(6))
                .stream()
                .map(p -> new DiaPrevistoDTO(p.getData(), p.getTempMinC(), p.getTempMaxC(), p.getChuvaMm(), p.getCodigoTempo()))
                .toList();
    }

    private static double umaCasa(double valor) {
        return Math.round(valor * 10) / 10.0;
    }
}
