package br.com.sentinela.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;

// PATCH /api/usuario/me: só os campos que vieram mudam. É uma classe (e não um record) para
// diferenciar "whatsappNumero": null (desvincular) de o campo nem ter vindo (deixar como está).
@Getter
public class AtualizarUsuarioDTO {

    @Size(min = 1, max = 120, message = "O nome deve ter de 1 a 120 caracteres.")
    private String nome;

    @Size(max = 20, message = "O número de WhatsApp deve ter no máximo 20 caracteres.")
    private String whatsappNumero;

    private boolean whatsappInformado;

    private Boolean avisosWhatsapp;

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setWhatsappNumero(String whatsappNumero) {
        this.whatsappNumero = whatsappNumero;
        this.whatsappInformado = true;
    }

    public void setAvisosWhatsapp(Boolean avisosWhatsapp) {
        this.avisosWhatsapp = avisosWhatsapp;
    }
}
