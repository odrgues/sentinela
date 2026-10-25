package br.com.sentinela.backend.exception;

// 410: link de nova senha vencido, já usado ou inexistente.
public class LinkExpiradoException extends RuntimeException {
    public LinkExpiradoException(String mensagem) {
        super(mensagem);
    }
}
