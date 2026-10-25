package br.com.sentinela.backend.exception;

// 429: pediu outro link de nova senha antes de 1 minuto.
public class MuitosPedidosException extends RuntimeException {
    public MuitosPedidosException(String mensagem) {
        super(mensagem);
    }
}
