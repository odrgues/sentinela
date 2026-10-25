// O token JWT que o login devolve. Sair é só apagar o token.
const CHAVE_DO_TOKEN = 'sentinela.token'

export function lerToken(): string | null {
  try {
    return localStorage.getItem(CHAVE_DO_TOKEN)
  } catch {
    // armazenamento bloqueado: a pessoa precisa entrar de novo
    return null
  }
}

export function guardarToken(token: string) {
  try {
    localStorage.setItem(CHAVE_DO_TOKEN, token)
  } catch {
    // armazenamento bloqueado: o login vale só até recarregar
  }
}

export function apagarToken() {
  try {
    localStorage.removeItem(CHAVE_DO_TOKEN)
  } catch {
    // armazenamento bloqueado: não tinha nada guardado
  }
}

// Avisa a casca que o token venceu, para ela levar a pessoa de volta ao login.
export const SESSAO_VENCIDA = 'sentinela:sessao-vencida'

export function encerrarSessaoVencida() {
  apagarToken()
  window.dispatchEvent(new Event(SESSAO_VENCIDA))
}
