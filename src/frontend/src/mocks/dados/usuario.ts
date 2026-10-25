import type { Entrada, Usuario } from '../../shared/api/tipos/usuario'

// Na API de mentira, só esta conta entra: joao@exemplo.com com a senha 123456.
export const EMAIL_DE_TESTE = 'joao@exemplo.com'
export const SENHA_DE_TESTE = '123456'

export const usuario: Usuario = {
  id: 7,
  nome: 'João',
  email: EMAIL_DE_TESTE,
  whatsappNumero: '+5534999999999',
  avisosWhatsapp: true,
}

export const entrada: Entrada = { token: 'token-de-mentira', usuario }
