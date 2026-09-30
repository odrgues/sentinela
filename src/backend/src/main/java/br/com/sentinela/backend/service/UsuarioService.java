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
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private Usuario buscarPorEmail (String email){
        return usuarioRepository.findByEmail(email)
                .orElseThrow(()-> new RecursoNaoEncontradoException("Usuário não encontrado com o e-mail: " + email));
    }

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO dto){
        if(usuarioRepository.existsByEmail(dto.getEmail())){
            throw new BusinessRuleException("Email já cadastrado no sistema.");
        }
        if(dto.getWhatsappNumero() != null && !dto.getWhatsappNumero().isBlank()) {
            if (usuarioRepository.existsByWhatsappNumero(dto.getWhatsappNumero())) {
                throw new BusinessRuleException("O número de WhatsApp já existe.");
            }
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        usuario.setWhatsappNumero(dto.getWhatsappNumero());
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

        if(dto.getNome() != null) {
            usuario.setNome(dto.getNome());
        }

        String novoEmail = dto.getEmail();

        if(novoEmail != null && !novoEmail.equals(usuario.getEmail())){
            if(usuarioRepository.existsByEmail(novoEmail)){
                throw new BusinessRuleException("E-mail já cadastrado");
            }
            usuario.setEmail(novoEmail);
        }

        String novoWhatsappNumero = dto.getWhatsappNumero();

        if(novoWhatsappNumero != null && !novoWhatsappNumero.equals(usuario.getWhatsappNumero())){
            if(usuarioRepository.existsByWhatsappNumero(novoWhatsappNumero)){
                throw new BusinessRuleException("Número já cadastrado.");
            }
            usuario.setWhatsappNumero(novoWhatsappNumero);
        }

        if(dto.getSenha() != null){
            usuario.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
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
