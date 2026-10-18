package br.com.sentinela.backend.service;

import br.com.sentinela.backend.dto.AtualizarUsuarioDTO;
import br.com.sentinela.backend.dto.UsuarioRequestDTO;
import br.com.sentinela.backend.dto.UsuarioResponseDTO;
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

public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private Usuario buscarPorEmail (String email){
        return usuarioRepository.findByEmail(email)
                .orElseThrow(()-> new RecursoNaoEncontradoException("Usuário não encontrado com o e-mail: " + email));
    }

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto){
        if(usuarioRepository.existsByEmail(dto.email())){
            throw new BusinessRuleException("Email já cadastrado no sistema.");
        }
        if(dto.whatsappNumero() != null && !dto.whatsappNumero().isBlank()) {
            if (usuarioRepository.existsByWhatsappNumero(dto.whatsappNumero())) {
                throw new BusinessRuleException("O número de WhatsApp já existe.");
            }
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        usuario.setWhatsappNumero(dto.whatsappNumero());
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponseDTO(usuarioSalvo);

    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO consultarUsuario (String email){

        Usuario usuario = buscarPorEmail(email);
        return new UsuarioResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarUsuario (String email, AtualizarUsuarioDTO dto){
        Usuario usuario = buscarPorEmail(email);

        if(dto.nome() != null) {
            usuario.setNome(dto.nome());
        }

        String novoEmail = dto.email();

        if(novoEmail != null && !novoEmail.equals(usuario.getEmail())){
            if(usuarioRepository.existsByEmail(novoEmail)){
                throw new BusinessRuleException("E-mail já cadastrado");
            }
            usuario.setEmail(novoEmail);
        }

        String novoWhatsappNumero = dto.whatsappNumero();

        if(novoWhatsappNumero != null && !novoWhatsappNumero.equals(usuario.getWhatsappNumero())){
            if(usuarioRepository.existsByWhatsappNumero(novoWhatsappNumero)){
                throw new BusinessRuleException("Número já cadastrado.");
            }
            usuario.setWhatsappNumero(novoWhatsappNumero);
        }

        if(dto.senha() != null){
            usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(usuarioAtualizado);
    }

    @Transactional
    public void deletarUsuario(String email){
        Usuario usuario = buscarPorEmail(email);
        usuarioRepository.delete(usuario);
    }



}
