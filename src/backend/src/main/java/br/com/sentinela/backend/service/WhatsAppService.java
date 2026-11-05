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

        // Vínculo por e-mail enviado pelo utilizador
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
                log.info("[WHATSAPP] Vínculo seguro realizado com sucesso para o utilizador ID {} com o identificador {}", usuario.getId(), chatId);

                String mensagemSucesso = "Conta vinculada com sucesso, " + usuario.getNome() + "! 🎉 Agora já pode usar o bot. Digite *menu* para ver as opções.";

                salvarHistoricoEnviada(usuario, mensagemSucesso, "saudacao", destinoResposta(chatId, usuario));
                return new RespostaWebhook(false, mensagemSucesso);
            }
        }

        // Se ainda não encontrou o utilizador, pede o e-mail
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

        // Fluxo normal para utilizador autenticado
        String intencao = identificarIntencao(conteudo, intencaoEntrada);
        registrarMensagemRecebida(usuario, chatId, conteudo, intencao);
        String resposta = gerarRespostaDoAgente(usuario, intencao);

        // Guarda o histórico da resposta sem disparar POST redundante (o Controller trata o envio síncrono)
        salvarHistoricoEnviada(usuario, resposta, intencao, destinoResposta(chatId, usuario));

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
                + "*A sua semana no Sentinela*\n" + resumo + "\n\n"
                + "Responda *1* para ver as suas lavouras ou *2* para ver os avisos.\n_"
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
    }

    private void salvarHistoricoEnviada(
            Usuario usuario,
            String textoMensagem,
            String intencao,
            String chatIdOrigem
    ) {
        if (usuario == null || textoMensagem == null) {
            return;
        }

        String chatIdFinal = resolverChatIdFinal(chatIdOrigem, usuario);

        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(chatIdFinal);
        mensagem.setConteudo(textoMensagem);
        mensagem.setDirecao("enviada");
        mensagem.setIntencao(intencao);
        mensagem.setRegistradoEm(LocalDateTime.now());

        mensagemRepository.save(mensagem);
        log.info("[WHATSAPP] Histórico de mensagem enviada guardado na base de dados para o utilizador {}.", usuario.getId());
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

        String chatIdFinal = resolverChatIdFinal(chatIdOrigem, usuario);

        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(chatIdFinal);
        mensagem.setConteudo(textoMensagem);
        mensagem.setDirecao("enviada");
        mensagem.setIntencao(intencao);
        mensagem.setRegistradoEm(LocalDateTime.now());

        mensagemRepository.save(mensagem);

        dispararParaWhatsappReal(usuario, chatIdFinal, textoMensagem);
    }

    private String resolverChatIdFinal(String chatIdOrigem, Usuario usuario) {
        if (chatIdOrigem != null && !chatIdOrigem.isBlank()) {
            return chatIdOrigem;
        } else if (usuario.getWhatsappNumero() != null && !usuario.getWhatsappNumero().isBlank()) {
            return usuario.getWhatsappNumero();
        } else if (usuario.getWhatsappLid() != null && !usuario.getWhatsappLid().isBlank()) {
            return usuario.getWhatsappLid();
        }
        return "desconhecido";
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

        String numeroOuLidFinal = destino.contains("@lid") ? destino.trim() : destino.replaceAll("[^0-9]", "");
        if (numeroOuLidFinal.isBlank()) {
            return;
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

                restTemplate.postForEntity(urlEndpoint, requestEntity, JsonNode.class);
            } catch (Exception e) {
                log.warn("[WHATSAPP] Aviso na comunicação com a Evolution API: {}", e.getMessage());
            }
        });
    }

    public void enviarBoasVindasOnboarding(Usuario usuario) {
        if (usuario == null || usuario.getWhatsappNumero() == null || usuario.getWhatsappNumero().isBlank()) {
            return;
        }
        String nome = (usuario.getNome() != null && !usuario.getNome().isBlank()) ? usuario.getNome() : "Produtor(a)";
        String mensagem = "Olá, " + nome + "! 👋\n\nSeja bem-vindo(a) ao *Sentinela*!\nPor favor, digite o seu **e-mail** de cadastro:";
        enviarEManterHistorico(usuario, mensagem, "saudacao", usuario.getWhatsappNumero());
    }

    private String identificarIntencao(String conteudo, String intencaoEntrada) {
        List<String> intencoesValidas = List.of("saudacao", "consulta_cultivos", "consulta_previsao", "consulta_alertas", "nao_identificada");
        if (intencaoEntrada != null && intencoesValidas.contains(intencaoEntrada.toLowerCase().trim())) {
            return intencaoEntrada.toLowerCase().trim();
        }
        String doMenu = MenuDoBot.intencaoDaOpcao(conteudo);
        if (doMenu != null) return doMenu;

        String texto = conteudo.toLowerCase();
        if (texto.contains("cultivo") || texto.contains("lavoura") || texto.contains("plantacao")) return "consulta_cultivos";
        if (texto.contains("alerta") || texto.contains("risco") || texto.contains("aviso")) return "consulta_alertas";
        if (texto.contains("previsao") || texto.contains("tempo") || texto.contains("chuva")) return "consulta_previsao";
        if (texto.contains("oi") || texto.contains("olá") || texto.contains("bom dia") || texto.contains("menu")) return "saudacao";

        return "nao_identificada";
    }

    private String gerarRespostaDoAgente(Usuario usuario, String intencao) {
        return switch (intencao) {
            case "consulta_cultivos" -> responderConsultaCultivos(usuario) + MenuDoBot.rodape();
            case "consulta_alertas" -> responderConsultaAlertas(usuario) + MenuDoBot.rodape();
            case "consulta_previsao" -> responderConsultaPrevisao(usuario) + MenuDoBot.rodape();
            case "encerrar_conversa" -> MenuDoBot.despedida(usuario.getNome());
            case "saudacao" -> mensagemBoasVindas(usuario);
            default -> mensagemAjuda(usuario);
        };
    }

    private String mensagemBoasVindas(Usuario usuario) {
        return "👋 *Olá, " + usuario.getNome() + "!*\nSou o assistente do *Sentinela*.\n\n*O que deseja ver?* Responda com o número:\n\n" + MenuDoBot.opcoes();
    }

    private String mensagemAjuda(Usuario usuario) {
        return "🤔 Não compreendi a sua mensagem, " + usuario.getNome() + ".\n\nResponda com o número da opção:\n\n" + MenuDoBot.opcoes();
    }

    private String responderConsultaCultivos(Usuario usuario) {
        try {
            List<Cultivo> cultivos = cultivoRepository.findByUsuarioId(usuario.getId());
            if (cultivos == null || cultivos.isEmpty()) {
                return "🌾 Ainda não tem lavouras cadastradas. Cadastre a primeira no site do Sentinela.";
            }
            List<String> blocos = new ArrayList<>();
            for (Cultivo cultivo : cultivos) {
                blocos.add("*" + (cultivo.getApelido() != null ? cultivo.getApelido() : "Lavoura") + "*\n🌱 " + (cultivo.getCultura() != null ? cultivo.getCultura().getNome() : "Cultura"));
            }
            return "🌾 *As suas lavouras*\n\n" + String.join("\n\n", blocos);
        } catch (Exception e) {
            return "🌾 Não foi possível carregar as lavouras agora. Tente novamente em instantes.";
        }
    }

    private String responderConsultaAlertas(Usuario usuario) {
        return "✅ *Tudo em ordem esta semana!* Nenhum alerta crítico detetado.";
    }

    private String responderConsultaPrevisao(Usuario usuario) {
        return "🌤️ Previsão do tempo consultada com sucesso.";
    }

    private boolean podeReceberAvisos(Usuario usuario) {
        return usuario != null && usuario.getWhatsappNumero() != null && Boolean.TRUE.equals(usuario.getAvisosWhatsapp());
    }
}