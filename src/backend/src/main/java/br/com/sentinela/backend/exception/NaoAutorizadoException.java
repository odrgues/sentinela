package br.com.sentinela.backend.exception;

// 401: e-mail ou senha errados no login.
public class NaoAutorizadoException extends RuntimeException {
    public NaoAutorizadoException(String mensagem) {
        super(mensagem);
    }
}
