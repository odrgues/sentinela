package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.FaseEnso;
import br.com.sentinela.backend.repository.FaseEnsoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

// Mantém a tabela fase_enso em dia com a série oficial do ONI da NOAA. A NOAA publica até o dia 5
// de cada mês e pode revisar os 2 últimos meses, então a rotina regrava os meses que já existem.
@Service
@RequiredArgsConstructor
@Slf4j
public class AtualizadorEnsoService {

    private static final String ENDERECO_DO_ONI = "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt";
    private static final int PRIMEIRO_ANO = 2015;
    private static final List<String> TEMPORADAS =
            List.of("DJF", "JFM", "FMA", "MAM", "AMJ", "MJJ", "JJA", "JAS", "ASO", "SON", "OND", "NDJ");

    public record MesDoOni(int ano, int mes, String fase, String intensidade, BigDecimal indice) {}

    private final FaseEnsoRepository faseEnsoRepository;
    private final RestTemplate restTemplate = criarRestTemplate();

    @Scheduled(cron = "0 0 7 6 * *", zone = "America/Sao_Paulo")
    public void atualizarTodoMes() {
        try {
            int gravados = atualizar();
            log.info("Série do El Niño atualizada pela NOAA: {} meses gravados.", gravados);
        } catch (Exception e) {
            log.error("Falha ao atualizar a série do El Niño: {}", e.getMessage());
        }
    }

    @Transactional
    public int atualizar() {
        String arquivo = restTemplate.getForObject(ENDERECO_DO_ONI, String.class);
        List<MesDoOni> meses = lerArquivo(arquivo == null ? "" : arquivo);
        for (MesDoOni mes : meses) {
            FaseEnso fase = faseEnsoRepository.findByAnoAndMes(mes.ano(), mes.mes()).orElseGet(FaseEnso::new);
            fase.setAno(mes.ano());
            fase.setMes(mes.mes());
            fase.setFase(mes.fase());
            fase.setIntensidade(mes.intensidade());
            fase.setIndice(mes.indice());
            faseEnsoRepository.save(fase);
        }
        return meses.size();
    }

    // Cada linha é "  JAS 2026  28.94   2.16": temporada de 3 meses, ano e anomalia.
    // A temporada vai para o mês do meio (DJF → janeiro, NDJ → dezembro).
    public static List<MesDoOni> lerArquivo(String arquivo) {
        List<MesDoOni> meses = new ArrayList<>();
        for (String linha : arquivo.split("\n")) {
            String[] partes = linha.trim().split("\\s+");
            if (partes.length < 4 || !TEMPORADAS.contains(partes[0])) continue;
            try {
                int ano = Integer.parseInt(partes[1]);
                if (ano < PRIMEIRO_ANO) continue;
                BigDecimal indice = new BigDecimal(partes[3]).setScale(2, RoundingMode.HALF_UP);
                meses.add(classificar(ano, TEMPORADAS.indexOf(partes[0]) + 1, indice));
            } catch (NumberFormatException e) {
                // Linha de cabeçalho ou incompleta: fica de fora.
            }
        }
        return meses;
    }

    // Índice >= +0,5 é El Niño, <= -0,5 é La Niña. Intensidade pelo valor absoluto:
    // até 0,99 fraco, até 1,49 moderado, até 1,99 forte, a partir de 2,0 muito forte.
    public static MesDoOni classificar(int ano, int mes, BigDecimal indice) {
        double valor = indice.doubleValue();
        if (Math.abs(valor) < 0.5) return new MesDoOni(ano, mes, "Neutro", null, indice);

        double absoluto = Math.abs(valor);
        String intensidade = absoluto < 1.0 ? "fraco" : absoluto < 1.5 ? "moderado" : absoluto < 2.0 ? "forte" : "muito forte";
        return new MesDoOni(ano, mes, valor > 0 ? "El Nino" : "La Nina", intensidade, indice);
    }

    private static RestTemplate criarRestTemplate() {
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(5_000);
        fabrica.setReadTimeout(15_000);
        return new RestTemplate(fabrica);
    }
}
