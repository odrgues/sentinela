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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    // Quanto tempo a lista de lavouras espera por um número antes de ele voltar a ser uma opção do menu.
    private static final long MINUTOS_PARA_ESCOLHER = 30;

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
        // Logo depois da lista de lavouras, um número é a lavoura escolhida, não uma opção do menu.
        Integer lavouraEscolhida = estaEscolhendoLavoura(usuario) ? MenuDoBot.numeroDaLavoura(conteudo) : null;
        String intencao = lavouraEscolhida != null
                ? "consulta_previsao"
                : identificarIntencao(conteudo, intencaoEntrada);
        registrarMensagemRecebida(usuario, chatId, conteudo, intencao);
        String resposta;
        if (MenuDoBot.ehPedidoDeSaida(conteudo)) {
            resposta = MenuDoBot.despedida(usuario.getNome());
        } else if (lavouraEscolhida != null) {
            resposta = responderLavoura(usuario, lavouraEscolhida);
        } else {
            resposta = gerarRespostaDoAgente(usuario, intencao);
        }

        enviarEManterHistorico(usuario, resposta, intencao, destinoResposta(chatId, usuario));

        return new RespostaWebhook(false, resposta);
    }

    public void notificarAlertaSeHabilitado(Alerta alerta) {
        if (alerta != null) {
            notificarAlertasSeHabilitado(List.of(alerta));
        }
    }

    // Uma mensagem por lavoura e tipo de aviso: quatro dias de geada viram um aviso só, e o "O que fazer"
    // aparece uma vez, em vez de quatro mensagens com o mesmo texto.
    public void notificarAlertasSeHabilitado(List<Alerta> alertas) {
        if (alertas == null) {
            return;
        }

        Map<String, List<Alerta>> grupos = new LinkedHashMap<>();
        for (Alerta alerta : alertas) {
            if (alerta == null || alerta.getCultivo() == null
                    || !"critico".equalsIgnoreCase(alerta.getSeveridade())) {
                continue;
            }
            grupos.computeIfAbsent(alerta.getCultivo().getId() + "|" + alerta.getTipo(), chave -> new ArrayList<>())
                    .add(alerta);
        }

        for (List<Alerta> grupo : grupos.values()) {
            Alerta primeiro = grupo.get(0);
            Usuario usuario = primeiro.getCultivo().getUsuario();

            if (!podeReceberAvisos(usuario)) {
                continue;
            }

            List<String> mensagens = grupo.stream().map(Alerta::getMensagem).toList();
            String texto = "🔴 *Aviso crítico · " + primeiro.getCultivo().getApelido() + "*\n\n"
                    + String.join("\n\n", mensagens);

            String orientacao = orientacaoService.oQueFazer(
                    primeiro.getCultivo().getCultura(),
                    primeiro.getTipo()
            );

            if (orientacao != null && !orientacao.isBlank()) {
                texto += "\n\n🛠️ *O que fazer*\n" + orientacao;
            }

            texto += "\n\nResponda *2* para ver todos os avisos.\n_" + FormatoDoBot.COMO_PARAR + "_";

            enviarEManterHistorico(usuario, texto, "consulta_alertas", usuario.getWhatsappNumero());
        }
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
                // Tira espaço, quebra de linha e caractere invisível que costumam vir junto ao colar a chave no Render.
                headers.set("apikey", evolutionApiKey.replaceAll("[^\\x21-\\x7E]", ""));

                Map<String, Object> body = Map.of(
                        "number", numeroOuLidFinal,
                        "text", mensagem
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

        String doMenu = MenuDoBot.intencaoDaOpcao(conteudo);
        if (doMenu != null) {
            return doMenu;
        }

        // "sair" também é "saudacao" para o banco, que só guarda cinco intenções; a resposta é a despedida.
        if (MenuDoBot.ehPedidoDeSaida(conteudo)) {
            return "saudacao";
        }

        // "menu", "0" ou "voltar" sozinhos abrem o menu antes de qualquer palavra-chave.
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
            case "consulta_cultivos" -> responderListaDeLavouras(usuario, "🌾 *Suas lavouras*");
            case "consulta_alertas" -> responderConsultaAlertas(usuario) + MenuDoBot.rodape();
            case "consulta_previsao" -> responderListaDeLavouras(usuario,
                    "🌤️ *Previsão do tempo*\nDe qual lavoura você quer ver?");
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

    // Cada lavoura numerada. A pessoa responde com o número e recebe os avisos e a previsão daquela lavoura.
    private String responderListaDeLavouras(Usuario usuario, String titulo) {
        try {
            List<Cultivo> cultivos = lavourasEmOrdem(usuario);

            if (cultivos.isEmpty()) {
                return "🌾 Você ainda não tem lavouras cadastradas.\nCadastre a primeira no site do Sentinela."
                        + MenuDoBot.rodape();
            }

            List<String> blocos = new ArrayList<>();
            int numero = 1;
            for (Cultivo cultivo : cultivos) {
                StringBuilder bloco = new StringBuilder("*").append(numero++).append(" · ")
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

            return titulo + "\n\n" + String.join("\n\n", blocos)
                    + "\n\n" + MenuDoBot.ESCOLHA_DA_LAVOURA + "\n_*0* para voltar ao menu._";
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar cultivos para o usuário {}: {}", usuario.getId(), e.getMessage());
            return "🌾 Não consegui carregar suas lavouras agora. Tente de novo em instantes.";
        }
    }

    // Sempre na mesma ordem, para o número que a pessoa vê na lista ser o da lavoura que ela recebe.
    private List<Cultivo> lavourasEmOrdem(Usuario usuario) {
        List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());
        if (cultivos == null) {
            return List.of();
        }
        return cultivos.stream().sorted(Comparator.comparing(Cultivo::getId)).toList();
    }

    // A última coisa que o bot disse foi a lista de lavouras, há pouco tempo?
    private boolean estaEscolhendoLavoura(Usuario usuario) {
        return mensagemRepository.findFirstByUsuarioIdAndDirecaoOrderByIdDesc(usuario.getId(), "enviada")
                .filter(m -> m.getConteudo() != null && m.getConteudo().contains(MenuDoBot.ESCOLHA_DA_LAVOURA))
                .filter(m -> m.getRegistradoEm() != null
                        && m.getRegistradoEm().isAfter(LocalDateTime.now().minusMinutes(MINUTOS_PARA_ESCOLHER)))
                .isPresent();
    }

    // Os avisos e a previsão de uma lavoura só, na mesma mensagem.
    private String responderLavoura(Usuario usuario, int numero) {
        try {
            List<Cultivo> cultivos = lavourasEmOrdem(usuario);

            if (numero > cultivos.size()) {
                return "🤔 Não achei a lavoura *" + numero + "*.\n\n"
                        + (cultivos.isEmpty()
                                ? "Você ainda não tem lavouras cadastradas."
                                : "Responda com um número de *1* a *" + cultivos.size() + "*.")
                        + "\n_*0* para voltar ao menu._";
            }

            Cultivo cultivo = cultivos.get(numero - 1);

            StringBuilder resposta = new StringBuilder("🌾 *")
                    .append(cultivo.getApelido() != null ? cultivo.getApelido() : "Lavoura")
                    .append("*\n🌱 ")
                    .append(cultivo.getCultura() != null ? cultivo.getCultura().getNome() : "Cultura não informada")
                    .append("\n📍 ")
                    .append(cultivo.getMunicipio() != null ? cultivo.getMunicipio().getNome() : "Município não informado")
                    .append("\n\n");

            if (!"em_andamento".equals(cultivo.getStatus())) {
                resposta.append("🚨 *Avisos da semana*\nEsta lavoura está ").append(FormatoDoBot.status(cultivo.getStatus()))
                        .append(", então não gero avisos para ela.");
            } else {
                List<String> avisos = avisosDaLavoura(cultivo);
                resposta.append("🚨 *Avisos da semana*\n");
                resposta.append(avisos.isEmpty()
                        ? "✅ Nenhum aviso de calor, frio ou chuva nos próximos 7 dias."
                        : String.join("\n\n", avisos));
            }

            resposta.append("\n\n").append(previsaoDaLavoura(cultivo));

            return resposta + MenuDoBot.rodape();
        } catch (Exception e) {
            log.error("[WHATSAPP] Erro ao buscar a lavoura {} do usuário {}: {}", numero, usuario.getId(), e.getMessage());
            return "🌾 Não consegui carregar essa lavoura agora. Tente de novo em instantes." + MenuDoBot.rodape();
        }
    }

    // Os avisos de calor, frio e chuva da semana de uma lavoura (os "tudo certo" ficam de fora), um bloco
    // por tipo de aviso: os dias daquele tipo juntos e o "O que fazer" uma vez só no fim do bloco.
    private List<String> avisosDaLavoura(Cultivo cultivo) {
        Map<String, List<Alerta>> porTipo = new LinkedHashMap<>();
        for (Alerta alerta : avisosService.daSemana(cultivo)) {
            if ("info".equalsIgnoreCase(alerta.getSeveridade())) {
                continue;
            }
            porTipo.computeIfAbsent(alerta.getTipo(), tipo -> new ArrayList<>()).add(alerta);
        }

        List<String> blocos = new ArrayList<>();
        for (Map.Entry<String, List<Alerta>> grupo : porTipo.entrySet()) {
            List<String> dias = new ArrayList<>();
            for (Alerta alerta : grupo.getValue()) {
                dias.add(FormatoDoBot.nivel(alerta.getSeveridade()) + " · " + cultivo.getApelido() + "\n"
                        + alerta.getMensagem());
            }
            StringBuilder bloco = new StringBuilder(String.join("\n\n", dias));

            String orientacao = cultivo.getCultura() == null
                    ? null
                    : orientacaoService.oQueFazer(cultivo.getCultura(), grupo.getKey());
            if (orientacao != null && !orientacao.isBlank()) {
                bloco.append("\n\n🛠️ *O que fazer*\n").append(orientacao);
            }
            blocos.add(bloco.toString());
        }
        return blocos;
    }

    private String previsaoDaLavoura(Cultivo cultivo) {
        try {
            if (cultivo.getMunicipio() == null) {
                return "☀️ A lavoura não tem município, e sem ele não consigo buscar a previsão.";
            }

            ClimaResponseDTO clima = climaService.buscarPrevisaoPorMunicipio(
                    cultivo.getMunicipio().getId()
            );

            StringBuilder resposta = new StringBuilder("🌤️ *Previsão para ")
                    .append(cultivo.getMunicipio().getNome())
                    .append("*\n\n");

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
            log.error("[WHATSAPP] Erro ao buscar previsão da lavoura {}: {}", cultivo.getId(), e.getMessage());
            return "🌤️ Não consegui carregar a previsão agora. Tente de novo em instantes.";
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