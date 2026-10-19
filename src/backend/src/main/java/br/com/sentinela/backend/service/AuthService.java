package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.*;
import br.com.sentinela.backend.exception.BusinessRuleException;
import br.com.sentinela.backend.exception.RecursoNaoEncontradoException;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void solicitarRedefinicaoSenha (EsqueciSenhaDTO dto){
        usuarioRepository.findByEmail(dto.email()).ifPresent(usuario -> {
            String tokenRedefinicao = tokenService.gerarToken(usuario);
            System.out.println("Token de redifinição: " + tokenRedefinicao);
        });
    }

    @Transactional
    public void redefinirSenha(RedefinirSenhaDTO dto){
        String email = tokenService.validarToken(dto.token());
        if(email == null){
            throw new BusinessRuleException("Token de redefinição inválido ou expirado.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
        usuario.setSenhaHash(passwordEncoder.encode(dto.novaSenha()));
        usuarioRepository.save(usuario);
    }
}