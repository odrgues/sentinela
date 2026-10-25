package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.AtualizarUsuarioDTO;
import br.com.sentinela.backend.dto.AuthResponseDTO;
import br.com.sentinela.backend.dto.ExcluirContaDTO;
import br.com.sentinela.backend.dto.UsuarioRequestDTO;
import br.com.sentinela.backend.dto.UsuarioResponseDTO;
import br.com.sentinela.backend.exception.AcessoNegadoException;
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
            throw new RecursoConflitoException("Este e-mail já tem uma conta.", "email");
        }

        String whatsappFormatado = normalizarWhatsapp(dto.whatsappNumero());
        if (whatsappFormatado != null && usuarioRepository.existsByWhatsappNumero(whatsappFormatado)) {
            throw new RecursoConflitoException("Este WhatsApp já está em outra conta.", "whatsappNumero");
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

    // O e-mail não muda. Trocar a senha passa pelo link de nova senha.
    @Transactional
    public UsuarioResponseDTO atualizarMeuPerfil(Usuario usuario, AtualizarUsuarioDTO dto) {
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            usuario.setNome(dto.getNome().trim());
        }

        if (dto.isWhatsappInformado()) {
            String novoWhatsapp = normalizarWhatsapp(dto.getWhatsappNumero());
            if (novoWhatsapp != null && !novoWhatsapp.equals(usuario.getWhatsappNumero())
                    && usuarioRepository.existsByWhatsappNumero(novoWhatsapp)) {
                throw new RecursoConflitoException("Este WhatsApp já está em outra conta.", "whatsappNumero");
            }
            usuario.setWhatsappNumero(novoWhatsapp);
        }

        if (dto.getAvisosWhatsapp() != null) {
            usuario.setAvisosWhatsapp(dto.getAvisosWhatsapp());
        }

        return new UsuarioResponseDTO(usuarioRepository.save(usuario));
    }

    // Os cultivos e os alertas saem junto (ON DELETE CASCADE); as mensagens ficam sem dono.
    @Transactional
    public void excluirMinhaConta(Usuario usuario, ExcluirContaDTO dto) {
        if (!passwordEncoder.matches(dto.senha(), usuario.getSenhaHash())) {
            throw new AcessoNegadoException("Senha incorreta.");
        }
        usuarioRepository.delete(usuario);
    }

    // "(34) 99999-9999" vira "+5534999999999" (formato E.164).
    public static String normalizarWhatsapp(String numero) {
        if (numero == null || numero.isBlank()) {
            return null;
        }
        String apenasNumeros = numero.replaceAll("\\D", "");
        if (apenasNumeros.isEmpty()) return null;
        return apenasNumeros.startsWith("55") && apenasNumeros.length() > 11
                ? "+" + apenasNumeros
                : "+55" + apenasNumeros;
    }
}
