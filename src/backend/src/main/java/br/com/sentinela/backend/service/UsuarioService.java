package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.*;
import br.com.sentinela.backend.exception.BusinessRuleException;
import br.com.sentinela.backend.exception.RecursoConflitoException;
import br.com.sentinela.backend.model.Usuario;
import br.com.sentinela.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Transactional
    public AuthResponseDTO criarUsuario(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RecursoConflitoException("E-mail já cadastrado no sistema.");
        }

        String whatsappFormatado = normalizarWhatsapp(dto.whatsappNumero());
        if (whatsappFormatado != null && usuarioRepository.existsByWhatsappNumero(whatsappFormatado)) {
            throw new RecursoConflitoException("O número de WhatsApp já está em uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        usuario.setWhatsappNumero(whatsappFormatado);
        usuario.setAvisosWhatsapp(true);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        String token = tokenService.gerarToken(usuarioSalvo);

        return new AuthResponseDTO(token, new UsuarioResponseDTO(usuarioSalvo));
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO obterMeuPerfil(Usuario usuario) {
        return new UsuarioResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarMeuPerfil(Usuario usuario, AtualizarUsuarioDTO dto) {
        if (dto.nome() != null && !dto.nome().isBlank()) {
            usuario.setNome(dto.nome());
        }

        if (dto.whatsappNumero() != null) {
            if (dto.whatsappNumero().isBlank()) {
                usuario.setWhatsappNumero(null);
            } else {
                String novoWhatsapp = normalizarWhatsapp(dto.whatsappNumero());
                if (!novoWhatsapp.equals(usuario.getWhatsappNumero()) && usuarioRepository.existsByWhatsappNumero(novoWhatsapp)) {
                    throw new RecursoConflitoException("Número de WhatsApp já cadastrado.");
                }
                usuario.setWhatsappNumero(novoWhatsapp);
            }
        }

        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        }

        Usuario atualizado = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(atualizado);
    }

    @Transactional
    public void excluirMinhaConta(Usuario usuario, ExcluirContaDTO dto) {
        if (!passwordEncoder.matches(dto.senha(), usuario.getSenhaHash())) {
            throw new BusinessRuleException("Senha incorreta.");
        }
        usuarioRepository.delete(usuario);
    }

    private String normalizarWhatsapp(String numero) {
        if (numero == null || numero.isBlank()) {
            return null;
        }
        String apenasNumeros = numero.replaceAll("\\D", "");
        if (apenasNumeros.isEmpty()) return null;
        return apenasNumeros.startsWith("55") ? "+" + apenasNumeros : "+55" + apenasNumeros;
    }
}