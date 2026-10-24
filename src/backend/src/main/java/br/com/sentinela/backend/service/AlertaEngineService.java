package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.ClimaResponseDTO;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Cultura;
import br.com.sentinela.backend.repository.AlertaRepository;
import br.com.sentinela.backend.repository.CultivoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaEngineService {

    private final CultivoRepository cultivoRepository;
    private final AlertaRepository alertaRepository;
    private final ClimaService climaService;

    @Transactional
    public List<Alerta> processarAlertasParaCultivo(Long cultivoId) {
        Cultivo cultivo = cultivoRepository.findById(cultivoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cultivo não encontrado com ID: " + cultivoId));
        ClimaResponseDTO clima = climaService.buscarPrevisaoPorMunicipio(cultivo.getMunicipio().getId());
        Cultura cultura = cultivo.getCultura();
        List<Alerta> alertasGerados = new ArrayList<>();

        // 1. Verificação Diária (Geada e Calor Extremo)
        for (ClimaResponseDTO.PrevisaoDiariaDTO dia : clima.previsaoDiaria()) {
            LocalDate dataPrevista = LocalDate.parse(dia.data());

            // Regra: Geada (Temp Mínima < Temp Crítica Baixa)
            if (dia.tempMin() < cultura.getTempCriticaBaixaC()) {
                salvarSeNaoExistir(
                        cultivo, "geada", "critico",
                        String.format("Mínima de %.1f °C prevista. O %s sofre dano térmico abaixo de %.1f °C.",
                                dia.tempMin(), cultura.getNome(), cultura.getTempCriticaBaixaC()),
                        dataPrevista, alertasGerados
                );
            }

            // Regra: Calor Extremo (Temp Máxima > Temp Crítica Alta)
            if (dia.tempMax() > cultura.getTempCriticaAltaC()) {
                salvarSeNaoExistir(
                        cultivo, "calor", "critico",
                        String.format("Máxima de %.1f °C prevista, acima do limite térmico de %.1f °C para %s.",
                                dia.tempMax(), cultura.getTempCriticaAltaC(), cultura.getNome()),
                        dataPrevista, alertasGerados
                );
            }
        }

        // 2. Verificação Semanal (Chuva Acumulada x Exigência da Cultura)
        LocalDate dataHoje = LocalDate.now();

        if (clima.chuvaAcumuladaSemanaMm() > cultura.getChuvaSemMaxMm()) {
            salvarSeNaoExistir(
                    cultivo, "chuva_excessiva", "atencao",
                    String.format("%.1f mm acumulados previstos para os próximos 7 dias, acima do limite máximo de %.1f mm para %s.",
                            clima.chuvaAcumuladaSemanaMm(), cultura.getChuvaSemMaxMm(), cultura.getNome()),
                    dataHoje, alertasGerados
            );
        } else if (clima.chuvaAcumuladaSemanaMm() < cultura.getChuvaSemMinMm()) {
            salvarSeNaoExistir(
                    cultivo, "deficit_hidrico", "atencao",
                    String.format("%.1f mm previstos na semana, abaixo do mínimo exigido de %.1f mm para %s.",
                            clima.chuvaAcumuladaSemanaMm(), cultura.getChuvaSemMinMm(), cultura.getNome()),
                    dataHoje, alertasGerados
            );
        }

        // 3. Se nenhuma condição crítica/atenção foi atingida, registra status favorável
        if (alertasGerados.isEmpty()) {
            salvarSeNaoExistir(
                    cultivo, "favoravel", "info",
                    String.format("Previsão semanal favorável para %s em %s. Chuva e temperatura dentro dos padrões ideais.",
                            cultura.getNome(), cultivo.getMunicipio().getNome()),
                    dataHoje, alertasGerados
            );
        }

        return alertasGerados;
    }

    private void salvarSeNaoExistir(Cultivo cultivo, String tipo, String severidade, String mensagem,
                                    LocalDate dataPrevista, List<Alerta> listaSaida) {
        boolean existe = alertaRepository.existsByCultivoIdAndTipoAndDataPrevista(cultivo.getId(), tipo, dataPrevista);

        if (!existe) {
            Alerta alerta = new Alerta();
            alerta.setCultivo(cultivo);
            alerta.setTipo(tipo);
            alerta.setSeveridade(severidade);
            alerta.setMensagem(mensagem);
            alerta.setDataPrevista(dataPrevista);

            Alerta salvo = alertaRepository.save(alerta);
            listaSaida.add(salvo);
        }
    }
}