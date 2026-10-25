package br.com.sentinela.backend.service;

import br.com.sentinela.backend.model.Alerta;
import br.com.sentinela.backend.model.Mensagem;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.MensagemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

// Envio pelo WhatsApp. Enquanto a conta da Meta não está ligada, a mensagem é gravada na tabela
// mensagem e aparece no log, com o mesmo texto dos modelos aviso_critico e resumo_semana.
@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    private final MensagemRepository mensagemRepository;
    private final OrientacaoService orientacaoService;

    // Só avisos críticos, só para quem tem WhatsApp e não mandou PARAR.
    public void notificarAlertaSeHabilitado(Alerta alerta) {
        Usuario usuario = alerta.getCultivo().getUsuario();
        if (!podeReceberAvisos(usuario) || !"critico".equals(alerta.getSeveridade())) return;

        String texto = "⚠️ Aviso do Sentinela para " + alerta.getCultivo().getApelido() + ": "
                + alerta.getMensagem() + " Responda AVISOS para ver os detalhes ou PARAR para não receber mais avisos.";

        String oQueFazer = orientacaoService.oQueFazer(alerta.getCultivo().getCultura(), alerta.getTipo());
        if (oQueFazer != null) {
            texto += "\n\nO que fazer: " + oQueFazer;
        }
        enviarEManterHistorico(usuario, texto, "consulta_alertas");
    }

    // Nas segundas: a frase da semana de cada lavoura numa linha só (regra dos modelos da Meta).
    public void enviarResumoDaSemana(Usuario usuario, String resumo) {
        if (!podeReceberAvisos(usuario)) return;
        String texto = "Bom dia, " + usuario.getNome() + "! Sua semana no Sentinela: " + resumo
                + " Responda 1 para ver cada lavoura ou PARAR para não receber mais avisos.";
        enviarEManterHistorico(usuario, texto, "consulta_cultivos");
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

    private boolean podeReceberAvisos(Usuario usuario) {
        return usuario.getWhatsappNumero() != null && !usuario.getWhatsappNumero().isBlank()
                && Boolean.TRUE.equals(usuario.getAvisosWhatsapp());
    }

    private void enviarEManterHistorico(Usuario usuario, String textoMensagem, String intencao) {
        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setChatId(usuario.getWhatsappNumero());
        mensagem.setConteudo(textoMensagem);
        mensagem.setDirecao("enviada");
        mensagem.setIntencao(intencao);
        mensagem.setRegistradoEm(Agora.agora());

        mensagemRepository.save(mensagem);

        log.info("[WHATSAPP] Para {} ({}):\n{}", usuario.getNome(), usuario.getWhatsappNumero(), textoMensagem);
    }
}
