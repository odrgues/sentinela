export type Usuario = {
  id: number
  nome: string
  email: string
  whatsappNumero?: string | null
  // A chave "Receber avisos automáticos", a mesma que o PARAR e o VOLTAR mudam no bot.
  avisosWhatsapp?: boolean
}

// O que o login e o cadastro devolvem.
export type Entrada = {
  token: string
  usuario: Usuario
}
