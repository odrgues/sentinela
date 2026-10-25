package br.com.sentinela.backend.exception;

import br.com.sentinela.backend.dto.ErroResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

// Todo erro sai no formato { status, mensagem, campos }, como na especificação da API.
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return erro(HttpStatus.BAD_REQUEST, "Confira os campos destacados.", campos);
    }

    @ExceptionHandler(RecursoConflitoException.class)
    public ResponseEntity<ErroResponseDTO> handleConflito(RecursoConflitoException ex) {
        Map<String, String> campos = ex.getCampo() == null ? null : Map.of(ex.getCampo(), ex.getMessage());
        return erro(HttpStatus.CONFLICT, ex.getMessage(), campos);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErroResponseDTO> handleBusinessRule(BusinessRuleException ex) {
        return erro(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    @ExceptionHandler(NaoAutorizadoException.class)
    public ResponseEntity<ErroResponseDTO> handleNaoAutorizado(NaoAutorizadoException ex) {
        return erro(HttpStatus.UNAUTHORIZED, ex.getMessage(), null);
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResponseDTO> handleAcessoNegado(AcessoNegadoException ex) {
        return erro(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponseDTO> handleNotFound(RecursoNaoEncontradoException ex) {
        return erro(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(LinkExpiradoException.class)
    public ResponseEntity<ErroResponseDTO> handleLinkExpirado(LinkExpiradoException ex) {
        return erro(HttpStatus.GONE, ex.getMessage(), null);
    }

    @ExceptionHandler(MuitosPedidosException.class)
    public ResponseEntity<ErroResponseDTO> handleMuitosPedidos(MuitosPedidosException ex) {
        return erro(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage(), null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponseDTO> handleJsonInvalido(HttpMessageNotReadableException ex) {
        return erro(HttpStatus.BAD_REQUEST, "Não deu para ler os dados enviados.", null);
    }

    // /api/cultivos/abc: um id que não é número não existe.
    @ExceptionHandler({MethodArgumentTypeMismatchException.class, NoResourceFoundException.class})
    public ResponseEntity<ErroResponseDTO> handleRotaInexistente(Exception ex) {
        return erro(HttpStatus.NOT_FOUND, "Não encontramos o que você procurou.", null);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResponseDTO> handleMetodo(HttpRequestMethodNotSupportedException ex) {
        return erro(HttpStatus.METHOD_NOT_ALLOWED, "Essa operação não existe nesta rota.", null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponseDTO> handleErroInesperado(Exception ex) {
        log.error("Erro inesperado", ex);
        return erro(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor.", null);
    }

    private ResponseEntity<ErroResponseDTO> erro(HttpStatus status, String mensagem, Map<String, String> campos) {
        return ResponseEntity.status(status).body(new ErroResponseDTO(status.value(), mensagem, campos));
    }
}
