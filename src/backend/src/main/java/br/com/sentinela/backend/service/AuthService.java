package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.AuthResponseDTO;
import br.com.sentinela.backend.dto.EsqueciSenhaDTO;
import br.com.sentinela.backend.dto.LoginRequestDTO;
import br.com.sentinela.backend.dto.RedefinirSenhaDTO;
import br.com.sentinela.backend.dto.UsuarioResponseDTO;
import br.com.sentinela.backend.exception.LinkExpiradoException;
import br.com.sentinela.backend.exception.MuitosPedidosException;
import br.com.sentinela.backend.exception.NaoAutorizadoException;
import br.com.sentinela.backend.model.RedefinicaoSenha;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.RedefinicaoSenhaRepository;
import br.com.sentinela.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MINUTOS_DE_VALIDADE_DO_LINK = 30;

    private final UsuarioRepository usuarioRepository;
    private final RedefinicaoSenhaRepository redefinicaoSenhaRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final EmailService emailService;
    private final SecureRandom aleatorio = new SecureRandom();

    @Value("${app.front.url}")
    private String enderecoDoFront;

    public AuthResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new NaoAutorizadoException("E-mail ou senha incorretos"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenhaHash())) {
            throw new NaoAutorizadoException("E-mail ou senha incorretos");
        }

        String token = tokenService.gerarToken(usuario);
        return new AuthResponseDTO(token, new UsuarioResponseDTO(usuario));
    }

    // Responde igual tenha conta ou não, para ninguém descobrir quem tem cadastro.
    @Transactional
    public void solicitarRedefinicaoSenha(EsqueciSenhaDTO dto) {
        usuarioRepository.findByEmail(dto.email()).ifPresent(usuario -> {
            redefinicaoSenhaRepository.findFirstByUsuarioIdOrderByCriadoEmDesc(usuario.getId())
                    .filter(ultimo -> ultimo.getCriadoEm().isAfter(LocalDateTime.now().minusMinutes(1)))
                    .ifPresent(ultimo -> {
                        throw new MuitosPedidosException("Aguarde 1 minuto para pedir outro link.");
                    });

            // Um pedido novo invalida os anteriores.
            LocalDateTime agora = LocalDateTime.now();
            redefinicaoSenhaRepository.findByUsuarioIdAndUsadoEmIsNull(usuario.getId())
                    .forEach(antigo -> antigo.setUsadoEm(agora));

            byte[] bytes = new byte[32];
            aleatorio.nextBytes(bytes);
            String codigo = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

            RedefinicaoSenha redefinicao = new RedefinicaoSenha();
            redefinicao.setUsuario(usuario);
            redefinicao.setTokenHash(sha256(codigo));
            redefinicao.setExpiraEm(agora.plusMinutes(MINUTOS_DE_VALIDADE_DO_LINK));
            redefinicaoSenhaRepository.save(redefinicao);

            String link = enderecoDoFront + "/nova-senha?token=" + codigo;
            emailService.enviarLinkDeNovaSenha(usuario.getEmail(), usuario.getNome(), link);
        });
    }

    @Transactional
    public void redefinirSenha(RedefinirSenhaDTO dto) {
        RedefinicaoSenha redefinicao = redefinicaoSenhaRepository.findByTokenHash(sha256(dto.token()))
                .filter(r -> r.getUsadoEm() == null && r.getExpiraEm().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new LinkExpiradoException("Este link expirou"));

        Usuario usuario = redefinicao.getUsuario();
        usuario.setSenhaHash(passwordEncoder.encode(dto.novaSenha()));
        redefinicao.setUsadoEm(LocalDateTime.now());
    }

    private static String sha256(String texto) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(texto.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
