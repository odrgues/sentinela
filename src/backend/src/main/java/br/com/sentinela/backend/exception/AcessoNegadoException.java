package br.com.sentinela.backend.exception;

// 403: a pessoa está logada, mas não pode fazer aquilo (cadastrar cultura sem ser admin,
// excluir a conta com a senha errada).
public class AcessoNegadoException extends RuntimeException {
    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
