package br.com.sentinela.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 409. Com campo, o front mostra a mensagem embaixo dele (e-mail, WhatsApp, apelido).
@Getter
@ResponseStatus(HttpStatus.CONFLICT)
public class RecursoConflitoException extends RuntimeException {

    private final String campo;

    public RecursoConflitoException(String message) {
        this(message, null);
    }

    public RecursoConflitoException(String message, String campo) {
        super(message);
        this.campo = campo;
    }
}
