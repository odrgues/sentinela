package br.com.sentinela.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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

                Para criar uma senha nova no Sentinela, abra o link abaixo. Ele vale por 30 minutos e funciona uma vez só.

                %s

                Se você não pediu uma senha nova, é só ignorar este e-mail.
                """.formatted(nome, link);

        JavaMailSender mail = enviador.getIfAvailable();
        if (servidor.isBlank() || mail == null) {
            // Desenvolvimento sem e-mail configurado: o link aparece no log para dar para testar.
            log.info("E-mail não configurado (MAIL_HOST). Link de nova senha para {}: {}", para, link);
            return;
        }

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(para);
        mensagem.setSubject("Sua senha nova no Sentinela");
        mensagem.setText(texto);
        try {
            mail.send(mensagem);
        } catch (Exception e) {
            // A resposta da API não pode mudar: ela diz a mesma coisa tenha conta ou não.
            log.error("Falha ao enviar o e-mail de nova senha para {}: {}", para, e.getMessage());
        }
    }
}
