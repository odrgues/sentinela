package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.LoginRequestDTO;
import br.com.sentinela.backend.dto.TokenResponseDTO;
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
    public ResponseEntity<TokenResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto){
        TokenResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }



}
