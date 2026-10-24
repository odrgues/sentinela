package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.ClimaResponseDTO;
import br.com.sentinela.backend.dto.PrevisaoOpenMeteoDTO;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Municipio;
import br.com.sentinela.backend.repository.MunicipioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ClimaService {

    private final MunicipioRepository municipioRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public ClimaResponseDTO buscarPrevisaoPorMunicipio(Long municipioId) {
        Municipio municipio = municipioRepository.findById(municipioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Município não encontrado com ID: " + municipioId));

        // Usa Locale.US para forçar o ponto (.) como separador decimal na URL da API
        String url = String.format(
                Locale.US,
                "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America/Sao_Paulo",
                municipio.getLatitude(),
                municipio.getLongitude()
        );

        PrevisaoOpenMeteoDTO resposta;
        try {
            resposta = restTemplate.getForObject(url, PrevisaoOpenMeteoDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao comunicar com a API Open-Meteo: " + e.getMessage());
        }

        if (resposta == null || resposta.daily() == null) {
            throw new RuntimeException("Não foi possível obter dados meteorológicos da API Open-Meteo.");
        }

        var daily = resposta.daily();
        List<ClimaResponseDTO.PrevisaoDiariaDTO> previsoesDiarias = new ArrayList<>();

        double tempMinSemana = Double.MAX_VALUE;
        double tempMaxSemana = Double.MIN_VALUE;
        double chuvaAcumulada = 0.0;

        for (int i = 0; i < daily.time().size(); i++) {
            double min = daily.temperature2mMin().get(i);
            double max = daily.temperature2mMax().get(i);
            double chuva = daily.precipitationSum().get(i) != null ? daily.precipitationSum().get(i) : 0.0;

            if (min < tempMinSemana) tempMinSemana = min;
            if (max > tempMaxSemana) tempMaxSemana = max;
            chuvaAcumulada += chuva;

            previsoesDiarias.add(new ClimaResponseDTO.PrevisaoDiariaDTO(
                    daily.time().get(i),
                    min,
                    max,
                    chuva
            ));
        }

        return new ClimaResponseDTO(
                municipio.getNome(),
                municipio.getUf(),
                tempMinSemana,
                tempMaxSemana,
                Math.round(chuvaAcumulada * 10.0) / 10.0,
                previsoesDiarias
        );
    }
}