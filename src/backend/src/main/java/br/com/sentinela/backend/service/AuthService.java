package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.LoginRequestDTO;
import br.com.sentinela.backend.dto.TokenResponseDTO;
import br.com.sentinela.backend.exception.BusinessRuleException;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public TokenResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new BusinessRuleException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenhaHash())) {
            throw new BusinessRuleException("E-mail ou senha inválidos.");
        }

        String token = tokenService.gerarToken(usuario);

        return new TokenResponseDTO("Bearer", token);
    }
}