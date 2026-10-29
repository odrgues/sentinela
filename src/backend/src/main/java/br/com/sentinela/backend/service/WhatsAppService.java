package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.ClimaResponseDTO;
import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Cultivo;
import br.com.sentinela.backend.model.Mensagem;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.AlertaRepository;
import br.com.sentinela.backend.repository.CultivoRepository;
import br.com.sentinela.backend.repository.MensagemRepository;
import br.com.sentinela.backend.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    private final MensagemRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final CultivoRepository cultivoRepository;
    private final AlertaRepository alertaRepository;
    private final ClimaService climaService;
    private final OrientacaoService orientacaoService;

    @Value("${evolution.api.url:http://localhost:8082}")
    private String evolutionApiUrl;

    @Value("${evolution.api.key:}")
    private String evolutionApiKey;

    public record RespostaWebhook(boolean naoCadastrado, String mensagem) {}

    @Transactional
    public String processarMensagemRecebida(String chatId, String conteudo) {
        return processarEAtenderMensagem(chatId, null, conteudo, null);
    }

    @Transactional
    public String processarMensagemRecebida(String chatId, String lid, String conteudo) {
        return processarEAtenderMensagem(chatId, lid, conteudo, null);
    }

    @Transactional
    public String processarEAtenderMensagem(
            String chatId,
            String conteudo,
            String intencaoEntrada
    ) {
        return processarEAtenderMensagem(chatId, null, conteudo, intencaoEntrada);
    }

    @Transactional
    public String processarEAtenderMensagem(
            String chatId,
            String lid,
            String conteudo,
            String intencaoEntrada
    ) {
        return executarFluxoMensagem(chatId, lid, conteudo, intencaoEntrada).mensagem();
    }

    @Transactional
    public RespostaWebhook processarWebhook(String chatId, String lid, String conteudo) {
        return executarFluxoMensagem(chatId, lid, conteudo, null);
    }

    private RespostaWebhook executarFluxoMensagem(
            String chatId,
            String lid,
            String conteudo,
            String intencaoEntrada
    ) {
        if (chatId == null || chatId.isBlank()
                || conteudo == null || conteudo.isBlank()) {
            return new RespostaWebhook(false, "Não consegui identificar a mensagem. Envie seu texto novamente.");
        }

        String lidAlvo = (lid != null && !lid.isBlank()) ? lid : (chatId.contains("@lid") ? chatId : null);
        Usuario usuario = null;

        if (lidAlvo != null) {
            Optional<Usuario> usuarioPorLid = usuarioRepository.findByWhatsappLid(lidAlvo);
            if (usuarioPorLid.isPresent()) {
                usuario = usuarioPorLid.get();
            }
        }

        if (usuario == null && !chatId.contains("@lid")) {
            String apenasNumerosChat = chatId.replaceAll("[^0-9]", "");
            if (!apenasNumerosChat.isBlank()) {
                usuario = usuarioRepository.findAll().stream()
                        .filter(u -> u.getWhatsappNumero() != null && !u.getWhatsappNumero().isBlank())
                        .filter(u -> u.getWhatsappNumero().replaceAll("[^0-9]", "").equals(apenasNumerosChat))
                        .findFirst()
                        .orElse(null);
            }
        }

        // 3. Vínculo por e-mail enviado pelo usuário
        String textoTrim = conteudo.trim();
        if (usuario == null && textoTrim.contains("@") && textoTrim.contains(".")) {
            Optional<Usuario> usuarioPorEmail = usuarioRepository.findByEmail(textoTrim.toLowerCase());
            if (usuarioPorEmail.isPresent()) {
                usuario = usuarioPorEmail.get();

                if (lidAlvo != null) {
                    usuario.setWhatsappLid(lidAlvo);
                }
                if (!chatId.contains("@lid")) {
                    usuario.setWhatsappNumero(chatId.replaceAll("[^0-9]", ""));
                }

                usuarioRepository.save(usuario);
                log.info("[WHATSAPP] Vínculo seguro realizado com sucesso para o usuário ID {} com o identificador {}", usuario.getId(), chatId);

                String mensagemSucesso = "Conta vinculada com sucesso, " + usuario.getNome() + "! 🎉 Agora você já pode usar o bot. Digite *menu* para ver as opções.";

                // Registra e dispara ativamente para o número real cadastrado (evita erro 400 do @lid)
                enviarEManterHistorico(usuario, mensagemSucesso, "saudacao", destinoResposta(chatId, usuario));
                return new RespostaWebhook(false, mensagemSucesso);
            }
        }

        // 4. Se ainda não encontrou o usuário, pede o e-mail educadamente
        if (usuario == null) {
            log.warn("Mensagem recebida de dispositivo/número não vinculado: chatId={}, lid={}", chatId, lidAlvo);
            String aviso = "Olá! 👋 Sou o assistente virtual do Sentinela, mas ainda não reconheço este número ou dispositivo.\n\n"
                    + "Por favor, digite o **e-mail** cadastrado na sua conta para ativarmos o seu acesso por aqui:";

            if (chatId.contains("@lid")) {
                return new RespostaWebhook(true, aviso);
            }

            dispararParaWhatsappReal(null, chatId, aviso);
            return new RespostaWebhook(false, aviso);
        }

        // Fluxo normal para usuário já autenticado e vinculado
        String intencao = identificarIntencao(conteudo, intencaoEntrada);
        registrarMensagemRecebida(usuario, chatId, conteudo, intencao);
        String resposta = gerarRespostaDoAgente(usuario, intencao);

        // Dispara a resposta utilizando o número real de telefone do usuário para garantir entrega sem Erro 400
        enviarEManterHistorico(usuario, resposta, intencao, destinoResposta(chatId, usuario));

        return new RespostaWebhook(false, resposta);
    }

    public void notificarAlertaSeHabilitado(Alerta alerta) {
        if (alerta == null || alerta.getCultivo() == null) {
            return;
        }

        Usuario usuario = alerta.getCultivo().getUsuario();

        if (!podeReceberAvisos(usuario)
                || !"critico".equalsIgnoreCase(alerta.getSeveridade())) {
            return;
        }

        String texto = "⚠️ Aviso do Sentinela para "
                + alerta.getCultivo().getApelido() + ": "
                + alerta.getMensagem()
                + " Responda AVISOS para ver os detalhes ou PARAR "
                + "para não receber mais avisos.";

        String orientacao = orientacaoService.oQueFazer(
                alerta.getCultivo().getCultura(),
                alerta.getTipo()
        );

        if (orientacao != null && !orientacao.isBlank()) {
            texto += "\n\nO que fazer: " + orientacao;
        }

        enviarEManterHistorico(usuario, texto, "consulta_alertas", usuario.getWhatsappNumero());
    }

    public void enviarResumoDaSemana(Usuario usuario, String resumo) {
        if (!podeReceberAvisos(usuario)) {
            return;
        }

        String texto = "Bom dia, " + usuario.getNome()
                + "! Sua semana no Sentinela: " + resumo
                + " Responda 1 para ver cada lavoura ou PARAR "
                + "para não receber mais avisos.";

        enviarEManterHistorico(usuario, texto, "consulta_cultivos", usuario.getWhatsappNumero());
    }

    public void registrarMensagemRecebida(
            Usuario usuario,
            String chatId,
            String conteudo,
            String intencao
    ) {
        if (usuario == null || chatId == null || chatId.isBlank()
                || conteudo == null || conteudo.isBlank()) {
            return;
        }

        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(chatId);
        mensagem.setConteudo(conteudo);
        mensagem.setDirecao("recebida");
        mensagem.setIntencao(
                intencao != null && !intencao.isBlank()
                        ? intencao
                        : "nao_identificada"
        );
        mensagem.setRegistradoEm(LocalDateTime.now());

        mensagemRepository.save(mensagem);

        log.info(
                "Mensagem recebida pelo WhatsApp e registrada para o usuário {}.",
                usuario.getId()
        );
    }

    private void enviarEManterHistorico(
            Usuario usuario,
            String textoMensagem,
            String intencao,
            String chatIdOrigem
    ) {
        if (usuario == null || textoMensagem == null) {
            return;
        }

        String chatIdFinal;
        if (chatIdOrigem != null && !chatIdOrigem.isBlank()) {
            chatIdFinal = chatIdOrigem;
        } else if (usuario.getWhatsappNumero() != null && !usuario.getWhatsappNumero().isBlank()) {
            chatIdFinal = usuario.getWhatsappNumero();
        } else if (usuario.getWhatsappLid() != null && !usuario.getWhatsappLid().isBlank()) {
            chatIdFinal = usuario.getWhatsappLid();
        } else {
            chatIdFinal = "desconhecido";
        }

        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(chatIdFinal);
        mensagem.setConteudo(textoMensagem);
        mensagem.setDirecao("enviada");
        mensagem.setIntencao(intencao);
        mensagem.setRegistradoEm(LocalDateTime.now());

        mensagemRepository.save(mensagem);

        log.info("[WHATSAPP] Mensagem gravada no banco para o usuário {}.", usuario.getId());

        dispararParaWhatsappReal(usuario, chatIdFinal, textoMensagem);
    }

    private String destinoResposta(String chatId, Usuario usuario) {
        // Se o usuário já tiver número cadastrado, prioriza o número real para evitar o Erro 400 do @lid na Evolution
        if (usuario != null && usuario.getWhatsappNumero() != null && !usuario.getWhatsappNumero().isBlank()) {
            return usuario.getWhatsappNumero();
        }
        if (chatId != null && !chatId.contains("@lid")) {
            return chatId;
        }
        return chatId;
    }

    private void dispararParaWhatsappReal(Usuario usuario, String destino, String mensagem) {
        if (destino == null || destino.isBlank()) {
            log.warn("[WHATSAPP] Tentativa de envio para destino nulo ou em branco.");
            return;
        }

        String numeroOuLidFinal;
        if (destino.contains("@lid")) {
            numeroOuLidFinal = destino.trim();
        } else {
            numeroOuLidFinal = destino.replaceAll("[^0-9]", "");
            if (numeroOuLidFinal.isBlank()) {
                log.error("[WHATSAPP] O identificador '{}' não possui dígitos numéricos válidos.", destino);
                return;
            }
        }

        CompletableFuture.runAsync(() -> {
            try {
                SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
                factory.setConnectTimeout(15000);
                factory.setReadTimeout(30000);

                RestTemplate restTemplate = new RestTemplate(factory);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("apikey", evolutionApiKey);

                Map<String, Object> body = Map.of(
                        "number", numeroOuLidFinal,
                        "textMessage", Map.of("text", mensagem)
                );

                HttpEntity<?> requestEntity = new HttpEntity<>(body, headers);

                String baseUrl = evolutionApiUrl != null ? evolutionApiUrl.replaceAll("/$", "") : "http://localhost:8082";
                String urlEndpoint = baseUrl + "/message/sendText/sentinela-bot";

                ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                        urlEndpoint,
                        requestEntity,
                        JsonNode.class
                );

                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("[WHATSAPP] Resposta enviada com sucesso para {}. Status: {}", numeroOuLidFinal, response.getStatusCode());
                }
            } catch (HttpStatusCodeException e) {
                log.error("[WHATSAPP] Evolution API recusou o envio para {}: {} - {}",
                        numeroOuLidFinal, e.getStatusCode(), e.getResponseBodyAsString());
            } catch (Exception e) {
                log.warn("[WHATSAPP] Aviso de atraso/timeout na comunicação com a Evolution API (o envio pode ter ocorrido em segundo plano): {}", e.getMessage());
            }
        });
    }

    public void enviarBoasVindasOnboarding(Usuario usuario) {
        if (usuario == null || usuario.getWhatsappNumero() == null || usuario.getWhatsappNumero().isBlank()) {
            log.warn("[WHATSAPP] Tentativa de enviar boas-vindas para usuário sem número cadastrado.");
            return;
        }

        String nome = (usuario.getNome() != null && !usuario.getNome().isBlank()) ? usuario.getNome() : "Produtor(a)";

        String mensagem = "Olá, " + nome + "! 👋\n\n"
                + "Seja bem-vindo(a) ao *Sentinela*!\n"
                + "Seu número foi cadastrado com sucesso na nossa plataforma.\n\n"
                + "Por favor, digite o seu **e-mail** de cadastro para vincularmos o seu acesso por aqui.";

        enviarEManterHistorico(usuario, mensagem, "saudacao", usuario.getWhatsappNumero());
    }

    private String identificarIntencao(
            String conteudo,
            String intencaoEntrada
    ) {
        List<String> intencoesValidas = List.of(
                "saudacao",
                "consulta_cultivos",
                "consulta_previsao",
                "consulta_alertas",
                "nao_identificada"
        );

        if (intencaoEntrada != null && !intencaoEntrada.isBlank()) {
            String entrada = intencaoEntrada.toLowerCase().trim();

            if (intencoesValidas.contains(entrada)) {
                return entrada;
            }
        }

        String texto = conteudo.toLowerCase();

        if (texto.contains("cultivo")
                || texto.contains("lavoura")
                || texto.contains("plantacao")
                || texto.contains("plantação")) {
            return "consulta_cultivos";
        }

        if (texto.contains("alerta")
                || texto.contains("risco")
                || texto.contains("aviso")) {
            return "consulta_alertas";
        }

        if (texto.contains("previsao")
                || texto.contains("previsão")
                || texto.contains("tempo")
                || texto.contains("chuva")
                || texto.contains("clima")) {
            return "consulta_previsao";
        }

        if (texto.contains("oi")
                || texto.contains("olá")
                || texto.contains("ola")
                || texto.contains("bom dia")
                || texto.contains("boa tarde")
                || texto.contains("boa noite")
                || texto.contains("menu")) {
            return "saudacao";
        }

        return "nao_identificada";
    }

    private String gerarRespostaDoAgente(
            Usuario usuario,
            String intencao
    ) {
        return switch (intencao) {
            case "consulta_cultivos" -> responderConsultaCultivos(usuario);
            case "consulta_alertas" -> responderConsultaAlertas(usuario);
            case "consulta_previsao" -> responderConsultaPrevisao(usuario);
            case "saudacao" -> mensagemBoasVindas(usuario);
            default -> mensagemAjuda(usuario);
        };
    }

    private String mensagemBoasVindas(Usuario usuario) {
        return "Olá, " + usuario.getNome()
                + "! 👋 Sou o assistente virtual do Sentinela.\n\n"
                + "Como posso ajudar?\n"
                + "1. Digite *cultivos* para consultar suas lavouras.\n"
                + "2. Digite *alertas* para consultar os riscos.\n"
                + "3. Digite *previsão* para consultar o tempo.";
    }

    private String mensagemAjuda(Usuario usuario) {
        return "Desculpe, " + usuario.getNome()
                + ", não entendi sua solicitação.\n\n"
                + "Você pode perguntar sobre *cultivos*, "
                + "*alertas* ou *previsão do tempo*.";
    }

    private String responderConsultaCultivos(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());

            if (cultivos == null || cultivos.isEmpty()) {
                return "🌾 Você ainda não possui cultivos cadastrados no Sentinela.";
            }

            StringBuilder resposta = new StringBuilder("🌾 SEUS CULTIVOS:\n\n");

            for (Cultivo cultivo : cultivos) {
                String nomeCultura = (cultivo.getCultura() != null) ? cultivo.getCultura().getNome() : "Não informada";
                String nomeMunicipio = (cultivo.getMunicipio() != null) ? cultivo.getMunicipio().getNome() : "Não informado";

                resposta.append("• ")
                        .append(cultivo.getApelido() != null ? cultivo.getApelido() : "Cultivo")
                        .append(" (").append(nomeCultura).append(")\n")
                        .append("Status: ").append(cultivo.getStatus() != null ? cultivo.getStatus() : "Ativo")
                        .append(" | Área: ").append(cultivo.getAreaHa()).append(" ha")
                        .append(" | Município: ").append(nomeMunicipio)
                        .append("\n\n");
            }

            return resposta.toString().trim();
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar cultivos para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🌾 Não foi possível carregar seus cultivos no momento. Tente novamente em instantes.";
        }
    }

    private String responderConsultaAlertas(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());

            if (cultivos == null || cultivos.isEmpty()) {
                return "Você ainda não possui cultivos cadastrados para verificar alertas.";
            }

            List<Alerta> alertas = alertaRepository.findByCultivoUsuarioId(usuario.getId());

            if (alertas == null || alertas.isEmpty()) {
                return "✅ Não há alertas agroclimáticos cadastrados para seus cultivos.";
            }

            StringBuilder resposta = new StringBuilder("🚨 ALERTAS AGROCLIMÁTICOS:\n\n");
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (Alerta alerta : alertas) {
                String icone = "critico".equalsIgnoreCase(alerta.getSeveridade()) ? "🚨" : "⚠️";

                resposta.append(icone)
                        .append(" ")
                        .append(alerta.getTipo())
                        .append(" (")
                        .append(alerta.getSeveridade())
                        .append(")\nLavoura: ")
                        .append(alerta.getCultivo() != null ? alerta.getCultivo().getApelido() : "Cultivo")
                        .append("\nData prevista: ")
                        .append(alerta.getDataPrevista() != null ? alerta.getDataPrevista().format(formato) : "Indefinida")
                        .append("\nDetalhes: ")
                        .append(alerta.getMensagem())
                        .append("\n\n");
            }

            return resposta.toString().trim();
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar alertas para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🚨 Não foi possível consultar os alertas no momento.";
        }
    }

    private String responderConsultaPrevisao(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());

            if (cultivos == null || cultivos.isEmpty()) {
                return "☀️ Cadastre um cultivo com município para consultar a previsão.";
            }

            Cultivo cultivo = cultivos.get(0);

            if (cultivo.getMunicipio() == null) {
                return "☀️ Seu cultivo principal não possui município associado para previsão.";
            }

            ClimaResponseDTO clima = climaService.buscarPrevisaoPorMunicipio(
                    cultivo.getMunicipio().getId()
            );

            return String.format(
                    "🌤️ PREVISÃO DO TEMPO — %s\n\n"
                            + "• Chuva acumulada nos próximos 7 dias: %.1f mm\n"
                            + "• Lavoura principal: %s (%s)",
                    cultivo.getMunicipio().getNome(),
                    clima.chuvaAcumuladaSemanaMm(),
                    cultivo.getApelido(),
                    cultivo.getCultura() != null ? cultivo.getCultura().getNome() : "Não informada"
            );
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar previsão para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🌤️ Não foi possível carregar a previsão do tempo no momento.";
        }
    }

    private boolean podeReceberAvisos(Usuario usuario) {
        return usuario != null
                && usuario.getWhatsappNumero() != null
                && !usuario.getWhatsappNumero().isBlank()
                && Boolean.TRUE.equals(usuario.getAvisosWhatsapp());
    }

    public void enviarRespostaDireta(String destino, String mensagem) {
        dispararParaWhatsappReal(null, destino, mensagem);
    }
}