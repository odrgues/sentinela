package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.ClimaResponseDTO;
import br.com.sentinela.backend.dto.DiaPrevistoDTO;
import br.com.sentinela.backend.dto.PrevisaoOpenMeteoDTO;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Municipio;
import br.com.sentinela.backend.repository.MunicipioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ClimaService {

    private final MunicipioRepository municipioRepository;
    private final RestTemplate restTemplate = criarRestTemplate();

    // Os 7 dias de hoje em diante, para um ponto exato. Lança exceção se a Open-Meteo falhar.
    public List<DiaPrevistoDTO> buscarSeteDias(double latitude, double longitude) {
        // Usa Locale.US para forçar o ponto (.) como separador decimal na URL da API
        String url = String.format(
                Locale.US,
                "https://api.open-meteo.com/v1/forecast?latitude=%.6f&longitude=%.6f"
                        + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
                        + "&timezone=America/Sao_Paulo&forecast_days=7",
                latitude,
                longitude
        );

        PrevisaoOpenMeteoDTO resposta;
        try {
            resposta = restTemplate.getForObject(url, PrevisaoOpenMeteoDTO.class);
        } catch (Exception e) {
            throw new IllegalStateException("Erro ao comunicar com a API Open-Meteo: " + e.getMessage(), e);
        }

        if (resposta == null || resposta.daily() == null || resposta.daily().time() == null) {
            throw new IllegalStateException("Não foi possível obter dados meteorológicos da API Open-Meteo.");
        }

        var daily = resposta.daily();
        List<DiaPrevistoDTO> dias = new ArrayList<>();
        for (int i = 0; i < daily.time().size(); i++) {
            Double min = daily.temperature2mMin().get(i);
            Double max = daily.temperature2mMax().get(i);
            if (min == null || max == null) continue;
            Double chuva = daily.precipitationSum().get(i);
            Integer codigo = daily.weatherCode() != null ? daily.weatherCode().get(i) : null;
            dias.add(new DiaPrevistoDTO(
                    LocalDate.parse(daily.time().get(i)),
                    min,
                    max,
                    chuva != null ? chuva : 0.0,
                    codigo != null ? codigo : 3
            ));
        }
        return dias;
    }

    public ClimaResponseDTO buscarPrevisaoPorMunicipio(Long municipioId) {
        Municipio municipio = municipioRepository.findById(municipioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Município não encontrado com ID: " + municipioId));

        List<DiaPrevistoDTO> dias = buscarSeteDias(municipio.getLatitude(), municipio.getLongitude());

        double tempMinSemana = dias.stream().mapToDouble(DiaPrevistoDTO::tempMinC).min().orElse(0);
        double tempMaxSemana = dias.stream().mapToDouble(DiaPrevistoDTO::tempMaxC).max().orElse(0);
        double chuvaAcumulada = dias.stream().mapToDouble(DiaPrevistoDTO::chuvaMm).sum();

        List<ClimaResponseDTO.PrevisaoDiariaDTO> previsoesDiarias = dias.stream()
                .map(dia -> new ClimaResponseDTO.PrevisaoDiariaDTO(
                        dia.data().toString(), dia.tempMinC(), dia.tempMaxC(), dia.chuvaMm()))
                .toList();

        return new ClimaResponseDTO(
                municipio.getNome(),
                municipio.getUf(),
                tempMinSemana,
                tempMaxSemana,
                Math.round(chuvaAcumulada * 10.0) / 10.0,
                previsoesDiarias
        );
    }

    // Sem limite de tempo, uma Open-Meteo lenta travaria a rotina das 6h e o cadastro da lavoura.
    private static RestTemplate criarRestTemplate() {
        SimpleClientHttpRequestFactory fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(5_000);
        fabrica.setReadTimeout(10_000);
        return new RestTemplate(fabrica);
    }
}
