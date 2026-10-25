package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.AuthResponseDTO;
import br.com.sentinela.backend.dto.EsqueciSenhaDTO;
import br.com.sentinela.backend.dto.LoginRequestDTO;
import br.com.sentinela.backend.dto.MensagemResponseDTO;
import br.com.sentinela.backend.dto.RedefinirSenhaDTO;
import br.com.sentinela.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<MensagemResponseDTO> esqueciSenha(@Valid @RequestBody EsqueciSenhaDTO dto) {
        authService.solicitarRedefinicaoSenha(dto);
        return ResponseEntity.ok(new MensagemResponseDTO("Se existir uma conta com esse e-mail, enviamos um link."));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<MensagemResponseDTO> redefinirSenha(@Valid @RequestBody RedefinirSenhaDTO dto) {
        authService.redefinirSenha(dto);
        return ResponseEntity.ok(new MensagemResponseDTO("Senha alterada. Entre com a nova senha."));
    }
}
