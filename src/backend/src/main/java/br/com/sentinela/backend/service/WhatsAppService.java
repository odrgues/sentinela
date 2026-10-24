package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Mensagem;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.MensagemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    private final MensagemRepository mensagemRepository;

    public void notificarAlertaSeHabilitado(Alerta alerta) {
        Usuario usuario = alerta.getCultivo().getUsuario();

        if (usuario.getWhatsappNumero() != null && !usuario.getWhatsappNumero().isBlank()) {

            if ("critico".equalsIgnoreCase(alerta.getSeveridade())
                    || "atencao".equalsIgnoreCase(alerta.getSeveridade())) {

                String textoMensagem = montarTextoNotificacao(alerta);
                enviarEManterHistorico(usuario, usuario.getWhatsappNumero(), textoMensagem, "consulta_alertas");
            }
        }
    }

    public void registrarMensagemRecebida(Usuario usuario, String chatId, String conteudo, String intencao) {
        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(chatId);
        mensagem.setConteudo(conteudo);
        mensagem.setDirecao("recebida");
        mensagem.setIntencao(intencao != null ? intencao : "nao_identificada");

        mensagemRepository.save(mensagem);
        log.info("Mensagem via WhatsApp recebida de chatId {} e gravada no MySQL.", chatId);
    }

    private void enviarEManterHistorico(Usuario usuario, String chatId, String textoMensagem, String intencao) {
        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(chatId);
        mensagem.setConteudo(textoMensagem);
        mensagem.setDirecao("enviada");
        mensagem.setIntencao(intencao);

        mensagemRepository.save(mensagem);

        log.info("==================================================================");
        log.info(" [WHATSAPP DISPARADO] ChatId: {} | Usuário: {}", chatId, usuario.getNome());
        log.info(" Conteúdo:\n{}", textoMensagem);
        log.info("==================================================================");
    }

    private String montarTextoNotificacao(Alerta alerta) {
        String icone = "critico".equalsIgnoreCase(alerta.getSeveridade()) ? "🚨" : "⚠️";
        String dataFormatada = alerta.getDataPrevista().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        return String.format(
                "%s *ALERTA AGROCLIMÁTICO SENTINELA* %s\n\n" +
                        "*Lavoura:* %s (%s)\n" +
                        "*Município:* %s\n" +
                        "*Risco:* %s (%s)\n" +
                        "*Data Prevista:* %s\n\n" +
                        "*Detalhes:* %s\n\n" +
                        "_Acesse o painel Sentinela para recomendações de manejo._",
                icone, icone,
                alerta.getCultivo().getApelido(),
                alerta.getCultivo().getCultura().getNome(),
                alerta.getCultivo().getMunicipio().getNome(),
                alerta.getTipo().toUpperCase(),
                alerta.getSeveridade().toUpperCase(),
                dataFormatada,
                alerta.getMensagem()
        );
    }
}