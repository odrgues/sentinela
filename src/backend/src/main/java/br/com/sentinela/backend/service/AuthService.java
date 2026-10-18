package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.AuthResponseDTO;
import br.com.sentinela.backend.dto.LoginRequestDTO;
import br.com.sentinela.backend.dto.UsuarioResponseDTO;
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

    public AuthResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new BusinessRuleException("E-mail ou senha incorretos"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenhaHash())) {
            throw new BusinessRuleException("E-mail ou senha incorretos");
        }

        String token = tokenService.gerarToken(usuario);
        return new AuthResponseDTO(token, UsuarioResponseDTO.resumido(usuario));
    }
}