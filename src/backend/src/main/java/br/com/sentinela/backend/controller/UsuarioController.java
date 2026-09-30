package br.com.sentinela.backend.controller;

import br.com.sentinela.backend.dto.AtualizarUsuarioDTO;
import br.com.sentinela.backend.dto.UsuarioRequestDTO;
import br.com.sentinela.backend.dto.UsuarioResponseDTO;
import br.com.sentinela.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/{email}")
    public ResponseEntity<UsuarioResponseDTO>consultarUsuario(@PathVariable String email){
       UsuarioResponseDTO usuarioConsultado = usuarioService.consultarUsuario(email);
        return  ResponseEntity.ok(usuarioConsultado);
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO>criarUsuario(@Valid @RequestBody UsuarioRequestDTO dto){
        UsuarioResponseDTO usuarioCadastrado = usuarioService.criarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCadastrado);
    }

    @PatchMapping("/{email}")
    public ResponseEntity<UsuarioResponseDTO>atualizarUsuario(@PathVariable String email,@Valid @RequestBody AtualizarUsuarioDTO dto){
        UsuarioResponseDTO usuarioAtualizado = usuarioService.atualizarUsuario(email, dto);
        return ResponseEntity.ok(usuarioAtualizado);

    }

    @DeleteMapping("/{email}")
    public ResponseEntity<Void>deletarUsuario(@PathVariable String email){
        usuarioService.deletarUsuario(email);
        return ResponseEntity.noContent().build();
    }

}
