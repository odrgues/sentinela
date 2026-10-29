package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.DiaPrevistoDTO;
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
    private final OrientacaoService orientacaoService;
    private final AvisosService avisosService;
    private final PrevisaoService previsaoService;

    @Value("${evolution.api.url:http://localhost:8082}")
    private String evolutionApiUrl;

    @Value("${evolution.api.key:}")
    private String evolutionApiKey;

    public record RespostaWebhook(boolean naoCadastrado, String mensagem) {}

    // O WhatsApp aceita uns 4 mil caracteres por mensagem; deixo folga.
    private static final int LIMITE_DA_MENSAGEM = 3500;

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

                enviarEManterHistorico(usuario, mensagemSucesso, "saudacao", destinoResposta(chatId, usuario));
                return new RespostaWebhook(false, mensagemSucesso);
            }
        }

        // 4. Se ainda não encontrou o usuário, pede o e-mail educadamente
        if (usuario == null) {
            log.warn("Mensagem recebida de dispositivo/número não vinculado: chatId={}, lid={}", chatId, lidAlvo);
            String aviso = "Olá! 👋 Sou o assistente virtual do Sentinela, mas ainda não reconheço este número ou dispositivo.\n\n"
                    + "Por favor, digite o *e-mail* cadastrado na sua conta para ativarmos o seu acesso por aqui:";

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

                String baseUrl = evolutionApiUrl != null ? evolutionApiUrl.replaceAll("/$", "") : "http://localhost:8082";
                String urlEndpoint = baseUrl + "/message/sendText/sentinela-bot";

                // Texto longo (a previsão de várias lavouras) vai em mais de uma mensagem, em ordem.
                for (String parte : FormatoDoBot.dividirEmMensagens(mensagem, LIMITE_DA_MENSAGEM)) {
                    Map<String, Object> body = Map.of(
                            "number", numeroOuLidFinal,
                            "textMessage", Map.of("text", parte)
                    );

                    HttpEntity<?> requestEntity = new HttpEntity<>(body, headers);

                    ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                            urlEndpoint,
                            requestEntity,
                            JsonNode.class
                    );

                    if (response.getStatusCode().is2xxSuccessful()) {
                        log.info("[WHATSAPP] Resposta enviada com sucesso para {}. Status: {}", numeroOuLidFinal, response.getStatusCode());
                    }
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

        // Quem acabou de cadastrar o número já está reconhecido: aqui não se pede o e-mail. O pedido
        // de e-mail é só para quem escreve de um número que não tem conta.
        String mensagem = "👋 *Olá, " + nome + "!*\n\n"
                + "Seja bem-vindo(a) ao *Sentinela*, o seu assistente do tempo na lavoura.\n"
                + "Seu número foi cadastrado, e por aqui eu aviso quando o clima ameaçar a sua plantação.\n\n"
                + "*O que você quer ver?* Responda com o número:\n\n"
                + MenuDoBot.opcoes() + "\n\n"
                + "_Digite *menu* a qualquer momento para ver as opções de novo._";

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

        String doMenu = MenuDoBot.intencaoDaOpcao(conteudo);
        if (doMenu != null) {
            return doMenu;
        }

        // "menu" sozinho abre o menu antes de qualquer palavra-chave.
        if (MenuDoBot.ehPedidoDeMenu(conteudo)) {
            return "saudacao";
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
                    blocos.add(FormatoDoBot.nivel(alerta.getSeveridade()) + " · " + cultivo.getApelido() + "\n"
                            + alerta.getMensagem() + oQueFazerDoAviso(cultivo, alerta));
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

    // "\n\n🛠️ *O que fazer*\n..." do aviso, ou vazio se não há texto para esse tipo de aviso.
    private String oQueFazerDoAviso(Cultivo cultivo, Alerta alerta) {
        String orientacao = orientacaoService.oQueFazer(cultivo.getCultura(), alerta.getTipo());
        return (orientacao == null || orientacao.isBlank()) ? "" : "\n🛠️ *O que fazer*\n" + orientacao;
    }

    // A previsão de 7 dias de cada lavoura em andamento, a mais urgente primeiro, com os avisos e
    // o que fazer embaixo dos dias. É a mesma previsão guardada que o site mostra.
    private String responderConsultaPrevisao(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId()).stream()
                    .filter(cultivo -> "em_andamento".equals(cultivo.getStatus()))
                    .toList();

            if (cultivos.isEmpty()) {
                return "☀️ Cadastre uma lavoura no site para eu mostrar a previsão do lugar dela.";
            }

            record Lavoura(Cultivo cultivo, List<Alerta> avisos) {
                int gravidade() {
                    return avisos.stream().mapToInt(a -> AvisosService.peso(a.getSeveridade())).max().orElse(0);
                }
            }

            List<Lavoura> lavouras = cultivos.stream()
                    .map(cultivo -> new Lavoura(cultivo, avisosService.daSemana(cultivo)))
                    .sorted((a, b) -> b.gravidade() - a.gravidade())
                    .toList();

            List<String> blocos = new ArrayList<>();
            blocos.add("🌤️ *Previsão das suas lavouras*\n_Próximos 7 dias_");

            for (Lavoura lavoura : lavouras) {
                Cultivo cultivo = lavoura.cultivo();
                StringBuilder bloco = new StringBuilder("*").append(cultivo.getApelido()).append("*");
                if (cultivo.getCultura() != null) {
                    bloco.append(" · ").append(cultivo.getCultura().getNome());
                }
                if (cultivo.getMunicipio() != null) {
                    bloco.append("\n📍 ").append(cultivo.getMunicipio().getNome());
                }

                List<DiaPrevistoDTO> dias = previsaoService.semana(cultivo.getId());
                if (dias.isEmpty()) {
                    bloco.append("\nSem previsão disponível agora.");
                } else {
                    double chuvaDaSemana = 0;
                    for (DiaPrevistoDTO dia : dias) {
                        chuvaDaSemana += dia.chuvaMm();
                        bloco.append("\n*").append(FormatoDoBot.diaDaSemana(dia.data())).append("*  ")
                                .append(FormatoDoBot.temperaturas(dia.tempMinC(), dia.tempMaxC()))
                                .append("  ")
                                .append(dia.chuvaMm() > 0 ? "🌧️ " + FormatoDoBot.milimetros(dia.chuvaMm()) : "☀️ sem chuva");
                    }
                    bloco.append("\n💧 Chuva na semana: *").append(FormatoDoBot.milimetros(chuvaDaSemana)).append("*");
                }

                List<Alerta> comRisco = lavoura.avisos().stream()
                        .filter(alerta -> !"info".equalsIgnoreCase(alerta.getSeveridade()))
                        .toList();
                if (comRisco.isEmpty()) {
                    bloco.append("\n\n🟢 *Tudo certo esta semana*");
                }
                for (Alerta alerta : comRisco) {
                    bloco.append("\n\n").append(FormatoDoBot.nivel(alerta.getSeveridade())).append("\n")
                            .append(alerta.getMensagem()).append(oQueFazerDoAviso(cultivo, alerta));
                }
                blocos.add(bloco.toString());
            }

            return String.join("\n\n", blocos);
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

    public void enviarRespostaDireta(String destino, String mensagem) {
        dispararParaWhatsappReal(null, destino, mensagem);
    }
}