package br.com.sentinela.backend.exception;

public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String mensagem) {
        super(mensagem);
    }
}