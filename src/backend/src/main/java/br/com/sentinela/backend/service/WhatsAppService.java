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
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
    private final AvisosService avisosService;

    @Value("${evolution.api.url:http://localhost:8082}")
    private String evolutionApiUrl;

    @Value("${evolution.api.key:}")
    private String evolutionApiKey;

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
        if (chatId == null || chatId.isBlank()
                || conteudo == null || conteudo.isBlank()) {
            return "Não consegui identificar a mensagem. Envie seu texto novamente.";
        }

        Usuario usuario = buscarUsuarioPorWhatsapp(chatId, lid);
        String intencao = identificarIntencao(conteudo, intencaoEntrada);

        if (usuario == null) {
            log.warn("Mensagem recebida de número não cadastrado: chatId={}, lid={}", chatId, lid);
            String aviso = "Olá! Sou o assistente do Sentinela, mas não encontrei um cadastro vinculado ao seu número. Cadastre seu WhatsApp na sua conta.";

            if (!chatId.contains("@lid")) {
                dispararParaWhatsappReal(null, chatId, aviso);
            }
            return aviso;
        }

        registrarMensagemRecebida(usuario, chatId, conteudo, intencao);
        String resposta = gerarRespostaDoAgente(usuario, intencao);
        enviarEManterHistorico(usuario, resposta, intencao, chatId);

        return resposta;
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

        String texto = "🔴 *Aviso crítico · " + alerta.getCultivo().getApelido() + "*\n\n"
                + alerta.getMensagem();

        String orientacao = orientacaoService.oQueFazer(
                alerta.getCultivo().getCultura(),
                alerta.getTipo()
        );

        if (orientacao != null && !orientacao.isBlank()) {
            texto += "\n\n🛠️ *O que fazer*\n" + orientacao;
        }

        texto += "\n\nResponda *2* para ver todos os avisos.\n_" + FormatoDoBot.COMO_PARAR + "_";

        enviarEManterHistorico(usuario, texto, "consulta_alertas", usuario.getWhatsappNumero());
    }

    public void enviarResumoDaSemana(Usuario usuario, String resumo) {
        if (!podeReceberAvisos(usuario)) {
            return;
        }

        String texto = "☀️ *Bom dia, " + usuario.getNome() + "!*\n\n"
                + "*Sua semana no Sentinela*\n" + resumo + "\n\n"
                + "Responda *1* para ver suas lavouras ou *2* para ver os avisos.\n_"
                + FormatoDoBot.COMO_PARAR + "_";

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
        if (chatIdOrigem != null && !chatIdOrigem.contains("@lid") && !chatIdOrigem.isBlank()) {
            chatIdFinal = chatIdOrigem;
        } else if (usuario.getWhatsappNumero() != null && !usuario.getWhatsappNumero().isBlank()) {
            chatIdFinal = usuario.getWhatsappNumero();
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

        dispararParaWhatsappReal(usuario, usuario.getWhatsappNumero(), textoMensagem);
    }

    private void dispararParaWhatsappReal(Usuario usuario, String telefone, String mensagem) {
        if (telefone == null || telefone.isBlank()) {
            log.warn("[WHATSAPP] Tentativa de envio para número de telefone nulo ou em branco.");
            return;
        }

        String numeroLimpo = telefone.replaceAll("[^0-9]", "");

        if (numeroLimpo.isBlank()) {
            log.error("[WHATSAPP] O identificador '{}' não possui dígitos numéricos válidos.", telefone);
            return;
        }

        CompletableFuture.runAsync(() -> {
            try {
                SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
                factory.setConnectTimeout(5000);
                factory.setReadTimeout(5000);

                RestTemplate restTemplate = new RestTemplate(factory);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("apikey", evolutionApiKey);

                Map<String, Object> body = Map.of(
                        "number", numeroLimpo,
                        "textMessage", Map.of("text", mensagem)
                );

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                // URL corrigida de forma segura contra barras duplas e apontando para a instância correta
                String baseUrl = evolutionApiUrl != null ? evolutionApiUrl.replaceAll("/$", "") : "http://localhost:8082";
                String urlEndpoint = baseUrl + "/message/sendText/sentinela-bot";

                ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                        urlEndpoint,
                        request,
                        JsonNode.class
                );

                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("[WHATSAPP] Resposta enviada com sucesso para {}. Status: {}", numeroLimpo, response.getStatusCode());
                }
            } catch (Exception e) {
                log.error("[WHATSAPP] Erro ao disparar mensagem para a Evolution API: {}", e.getMessage());
            }
        });
    }

    public void enviarBoasVindasOnboarding(Usuario usuario) {
        if (usuario == null || usuario.getWhatsappNumero() == null || usuario.getWhatsappNumero().isBlank()) {
            log.warn("[WHATSAPP] Tentativa de enviar boas-vindas para usuário sem número cadastrado.");
            return;
        }

        String nome = (usuario.getNome() != null && !usuario.getNome().isBlank()) ? usuario.getNome() : "Produtor(a)";

        String mensagem = "👋 *Olá, " + nome + "!*\n\n"
                + "Seja bem-vindo(a) ao *Sentinela*, o seu assistente do tempo na lavoura.\n"
                + "Seu número foi cadastrado, e por aqui eu aviso quando o clima ameaçar a sua plantação.\n\n"
                + "*O que você quer ver?* Responda com o número:\n\n"
                + MenuDoBot.opcoes() + "\n\n"
                + "_Digite *menu* a qualquer momento para ver as opções de novo._";

        enviarEManterHistorico(usuario, mensagem, "saudacao", usuario.getWhatsappNumero());

        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(2000);
                capturarEVincularLidNoCadastro(usuario);
            } catch (Exception e) {
                log.error("[WHATSAPP] Erro ao sincronizar LID automático no onboarding: {}", e.getMessage());
            }
        });
    }

    private void capturarEVincularLidNoCadastro(Usuario usuario) {
        if (usuario == null || usuario.getWhatsappNumero() == null) {
            return;
        }

        String numeroLimpo = usuario.getWhatsappNumero().replaceAll("[^0-9]", "");
        if (numeroLimpo.isBlank()) {
            return;
        }

        try {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(4000);
            factory.setReadTimeout(4000);

            RestTemplate restTemplate = new RestTemplate(factory);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", evolutionApiKey);

            Map<String, Object> bodyMap = Map.of("numbers", List.of(numeroLimpo));
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(bodyMap, headers);

            String baseUrl = evolutionApiUrl != null ? evolutionApiUrl.replaceAll("/$", "") : "http://localhost:8082";
            String urlEndpoint = baseUrl + "/chat/whatsappNumbers/sentinela-bot";

            ResponseEntity<JsonNode> response = restTemplate.postForEntity(urlEndpoint, request, JsonNode.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode body = response.getBody();
                JsonNode item = body.isArray() && !body.isEmpty() ? body.get(0) : body;

                String lidCapturado = item.path("lid").asText("");
                if (lidCapturado.isBlank()) {
                    lidCapturado = item.path("jid").asText("");
                }

                if (!lidCapturado.isBlank() && lidCapturado.contains("@lid")) {
                    usuario.setWhatsappLid(lidCapturado.trim());
                    usuarioRepository.save(usuario);
                    log.info("[WHATSAPP] AUTOMÁTICO: whatsapp_lid {} vinculado ao usuário ID {} ({}) no cadastro!",
                            lidCapturado, usuario.getId(), usuario.getNome());
                }
            }
        } catch (Exception e) {
            log.warn("[WHATSAPP] Falha ao capturar LID automático no onboarding para {}: {}", numeroLimpo, e.getMessage());
        }
    }

    private Usuario buscarUsuarioPorWhatsapp(String chatId, String lid) {
        String lidLimpo = (lid != null && !lid.isBlank())
                ? lid.trim()
                : (chatId != null && chatId.contains("@lid") ? chatId.trim() : "");

        if (!lidLimpo.isBlank() && lidLimpo.contains("@lid")) {
            Optional<Usuario> usuarioPorLid = usuarioRepository.findByWhatsappLid(lidLimpo);
            if (usuarioPorLid.isPresent()) {
                log.info("[WHATSAPP] Usuário {} localizado diretamente via whatsapp_lid: {}", usuarioPorLid.get().getId(), lidLimpo);
                return usuarioPorLid.get();
            }
        }

        if (chatId != null && !chatId.contains("@lid")) {
            Usuario usuarioPorNumero = buscarUsuarioPorNumero(chatId, lidLimpo);
            if (usuarioPorNumero != null) {
                return usuarioPorNumero;
            }
        }

        if (!lidLimpo.isBlank() && lidLimpo.contains("@lid")) {
            List<Usuario> usuariosSemLid = usuarioRepository.findAll().stream()
                    .filter(u -> u.getWhatsappLid() == null || u.getWhatsappLid().isBlank())
                    .filter(u -> u.getWhatsappNumero() != null && !u.getWhatsappNumero().isBlank())
                    .toList();

            if (!usuariosSemLid.isEmpty()) {
                Usuario usuarioAlvo = usuariosSemLid.get(usuariosSemLid.size() - 1);
                vincularLidSeNecessario(usuarioAlvo, lidLimpo);
                log.info("[WHATSAPP] SUCESSO: LID {} vinculado automaticamente ao usuário ID {} ({})!",
                        lidLimpo, usuarioAlvo.getId(), usuarioAlvo.getNome());

                return usuarioAlvo;
            }
        }

        return null;
    }

    private Usuario buscarUsuarioPorNumero(String numero, String lid) {
        List<Usuario> todosUsuarios = usuarioRepository.findAll();
        String apenasNumerosChat = numero.replaceAll("[^0-9]", "");

        for (Usuario u : todosUsuarios) {
            if (u.getWhatsappNumero() == null || u.getWhatsappNumero().isBlank()) {
                continue;
            }

            String apenasNumerosBanco = u.getWhatsappNumero().replaceAll("[^0-9]", "");

            if (!apenasNumerosChat.isBlank() && !apenasNumerosBanco.isBlank()) {
                boolean mesmoNumero = apenasNumerosBanco.equals(apenasNumerosChat);
                boolean mesmoComTratamentoNove = (apenasNumerosBanco.length() == 13 && apenasNumerosChat.length() == 12 && apenasNumerosBanco.substring(0, 4).concat(apenasNumerosBanco.substring(5)).equals(apenasNumerosChat))
                        || (apenasNumerosBanco.length() == 12 && apenasNumerosChat.length() == 13 && apenasNumerosBanco.equals(apenasNumerosChat.substring(0, 4).concat(apenasNumerosChat.substring(5))));

                if (mesmoNumero || mesmoComTratamentoNove) {
                    vincularLidSeNecessario(u, lid);
                    return u;
                }
            }
        }

        return null;
    }

    private void vincularLidSeNecessario(Usuario usuario, String lidOriginal) {
        if (usuario != null && lidOriginal != null && lidOriginal.contains("@lid")) {
            String lidLimpo = lidOriginal.trim();
            int linhasAfetadas = usuarioRepository.atualizarWhatsappLidDireto(usuario.getId(), lidLimpo);
            if (linhasAfetadas > 0) {
                usuario.setWhatsappLid(lidLimpo);
                log.info("[WHATSAPP] SUCESSO: whatsapp_lid '{}' gravado no MySQL para o usuário ID {}!", lidLimpo, usuario.getId());
            }
        }
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

        String doMenu = MenuDoBot.intencaoDaOpcao(conteudo);
        if (doMenu != null) {
            return doMenu;
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
            case "consulta_cultivos" -> responderConsultaCultivos(usuario) + MenuDoBot.rodape();
            case "consulta_alertas" -> responderConsultaAlertas(usuario) + MenuDoBot.rodape();
            case "consulta_previsao" -> responderConsultaPrevisao(usuario) + MenuDoBot.rodape();
            case "saudacao" -> mensagemBoasVindas(usuario);
            default -> mensagemAjuda(usuario);
        };
    }

    private String mensagemBoasVindas(Usuario usuario) {
        return "👋 *Olá, " + usuario.getNome() + "!*\n"
                + "Sou o assistente do *Sentinela*.\n\n"
                + "*O que você quer ver?* Responda com o número:\n\n"
                + MenuDoBot.opcoes();
    }

    private String mensagemAjuda(Usuario usuario) {
        return "🤔 Não entendi sua mensagem, " + usuario.getNome() + ".\n\n"
                + "Responda com o número da opção:\n\n"
                + MenuDoBot.opcoes();
    }

    private String responderConsultaCultivos(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());

            if (cultivos == null || cultivos.isEmpty()) {
                return "🌾 Você ainda não tem lavouras cadastradas.\nCadastre a primeira no site do Sentinela.";
            }

            List<String> blocos = new ArrayList<>();
            for (Cultivo cultivo : cultivos) {
                StringBuilder bloco = new StringBuilder("*")
                        .append(cultivo.getApelido() != null ? cultivo.getApelido() : "Lavoura")
                        .append("*\n🌱 ")
                        .append(cultivo.getCultura() != null ? cultivo.getCultura().getNome() : "Cultura não informada");

                String area = FormatoDoBot.area(cultivo.getAreaHa());
                if (!area.isEmpty()) {
                    bloco.append(" · ").append(area);
                }

                bloco.append("\n📍 ")
                        .append(cultivo.getMunicipio() != null ? cultivo.getMunicipio().getNome() : "Município não informado")
                        .append(" · ").append(FormatoDoBot.status(cultivo.getStatus()));

                if (cultivo.getDataPlantio() != null) {
                    bloco.append("\n🗓️ Plantada em ").append(FormatoDoBot.dia(cultivo.getDataPlantio()));
                }
                blocos.add(bloco.toString());
            }

            return "🌾 *Suas lavouras*\n\n" + String.join("\n\n", blocos);
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar cultivos para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🌾 Não consegui carregar suas lavouras agora. Tente de novo em instantes.";
        }
    }

    // Os avisos da semana, como no site: os que já passaram não entram.
    private String responderConsultaAlertas(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());

            if (cultivos == null || cultivos.isEmpty()) {
                return "🌾 Você ainda não tem lavouras cadastradas.\nCadastre a primeira no site do Sentinela.";
            }

            List<String> blocos = new ArrayList<>();
            for (Cultivo cultivo : cultivos) {
                if (!"em_andamento".equals(cultivo.getStatus())) {
                    continue;
                }
                for (Alerta alerta : avisosService.daSemana(cultivo)) {
                    if ("info".equalsIgnoreCase(alerta.getSeveridade())) {
                        continue;
                    }
                    // O texto do aviso já cita o dia quando ele importa (o pico de calor, a geada).
                    blocos.add(FormatoDoBot.nivel(alerta.getSeveridade()) + " · " + cultivo.getApelido() + "\n"
                            + alerta.getMensagem());
                }
            }

            if (blocos.isEmpty()) {
                return "✅ *Tudo certo esta semana!*\n\nNenhum aviso de calor, frio ou chuva para as suas lavouras nos próximos 7 dias.";
            }

            return "🚨 *Avisos da semana*\n\n" + String.join("\n\n", blocos);
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar alertas para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🚨 Não consegui consultar os avisos agora. Tente de novo em instantes.";
        }
    }

    private String responderConsultaPrevisao(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());

            if (cultivos == null || cultivos.isEmpty()) {
                return "☀️ Cadastre uma lavoura no site para eu mostrar a previsão do lugar dela.";
            }

            Cultivo cultivo = cultivos.get(0);

            if (cultivo.getMunicipio() == null) {
                return "☀️ A sua lavoura *" + cultivo.getApelido() + "* não tem município, e sem ele não consigo buscar a previsão.";
            }

            ClimaResponseDTO clima = climaService.buscarPrevisaoPorMunicipio(
                    cultivo.getMunicipio().getId()
            );

            StringBuilder resposta = new StringBuilder("🌤️ *Previsão para ")
                    .append(cultivo.getMunicipio().getNome())
                    .append("*\n_")
                    .append(cultivo.getApelido())
                    .append("_\n\n");

            if (clima.previsaoDiaria() != null) {
                for (ClimaResponseDTO.PrevisaoDiariaDTO dia : clima.previsaoDiaria()) {
                    resposta.append("*").append(FormatoDoBot.diaDaSemana(LocalDate.parse(dia.data()))).append("*  ")
                            .append(FormatoDoBot.temperaturas(dia.tempMin(), dia.tempMax()))
                            .append("  ")
                            .append(dia.chuvaMm() > 0 ? "🌧️ " + FormatoDoBot.milimetros(dia.chuvaMm()) : "☀️ sem chuva")
                            .append("\n");
                }
                resposta.append("\n");
            }

            resposta.append("💧 Chuva na semana: *")
                    .append(FormatoDoBot.milimetros(clima.chuvaAcumuladaSemanaMm()))
                    .append("*");

            return resposta.toString();
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar previsão para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🌤️ Não consegui carregar a previsão agora. Tente de novo em instantes.";
        }
    }

    private boolean podeReceberAvisos(Usuario usuario) {
        return usuario != null
                && usuario.getWhatsappNumero() != null
                && !usuario.getWhatsappNumero().isBlank()
                && Boolean.TRUE.equals(usuario.getAvisosWhatsapp());
    }
}