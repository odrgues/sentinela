package br.com.sentinela.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final ObjectProvider<JavaMailSender> enviador;

    // Vazio em desenvolvimento: aí o link vai para o log em vez de sair por e-mail.
    @Value("${spring.mail.host:}")
    private String servidor;

    @Value("${spring.mail.username:}")
    private String remetente;

    public void enviarLinkDeNovaSenha(String para, String nome, String link) {
        String texto = """
                Olá, %s!

                Recebemos um pedido para criar uma senha nova na sua conta do Sentinela. Abra o link abaixo para escolher a senha. Ele vale por 30 minutos e funciona uma vez só.

                %s

                Se você não fez esse pedido, é só ignorar este e-mail: a sua senha continua a mesma.
                """.formatted(nome, link);

        JavaMailSender mail = enviador.getIfAvailable();
        if (servidor.isBlank() || mail == null) {
            // Desenvolvimento sem e-mail configurado: o link aparece no log para dar para testar.
            log.info("E-mail não configurado (MAIL_HOST). Link de nova senha para {}: {}", para, link);
            return;
        }

        try {
            MimeMessage mensagem = mail.createMimeMessage();
            // Texto simples para quem não vê HTML, e o botão para quem vê.
            MimeMessageHelper corpo = new MimeMessageHelper(mensagem, true, "UTF-8");
            corpo.setFrom(remetente);
            corpo.setTo(para);
            corpo.setSubject("Crie sua senha nova no Sentinela");
            corpo.setText(texto, html(nome, link));
            mail.send(mensagem);
        } catch (Exception e) {
            // A resposta da API não pode mudar: ela diz a mesma coisa tenha conta ou não.
            log.error("Falha ao enviar o e-mail de nova senha para {}: {}", para, e.getMessage());
        }
    }

    // O nome vem do cadastro, então é escapado. O link é gerado aqui e não leva texto de fora.
    private static String html(String nome, String link) {
        return """
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1C2A1F">
                  <h1 style="font-size:20px;margin:0 0 20px;color:#1C3A12">Sentinela</h1>
                  <p style="font-size:16px;line-height:1.5;margin:0 0 12px">Olá, %s!</p>
                  <p style="font-size:16px;line-height:1.5;margin:0 0 24px">Recebemos um pedido para criar uma senha nova na sua conta. Clique no botão para escolher a senha. O link vale por 30 minutos e funciona uma vez só.</p>
                  <p style="margin:0 0 24px"><a href="%s" style="display:inline-block;padding:14px 28px;background:#1C3A12;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:16px;font-weight:bold">Criar minha senha nova</a></p>
                  <p style="font-size:14px;line-height:1.5;color:#555F54;margin:0">Se você não fez esse pedido, é só ignorar este e-mail: a sua senha continua a mesma.</p>
                </div>
                """.formatted(HtmlUtils.htmlEscape(nome), HtmlUtils.htmlEscape(link));
    }
}
