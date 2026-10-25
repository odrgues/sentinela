import { http, HttpResponse } from 'msw'
import { EMAIL_DE_TESTE, SENHA_DE_TESTE, entrada, usuario } from './dados/usuario'

type Corpo = Record<string, string | undefined>

function erro(status: number, mensagem: string) {
  return HttpResponse.json({ status, mensagem }, { status })
}

// Login, cadastro e senha, com as mesmas respostas da especificação da API.
export const handlersDeAcesso = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, senha } = (await request.json()) as Corpo
    if (email !== EMAIL_DE_TESTE || senha !== SENHA_DE_TESTE) {
      return erro(401, 'E-mail ou senha incorretos')
    }
    return HttpResponse.json(entrada)
  }),

  http.post('/api/usuario', async ({ request }) => {
    const { nome, email } = (await request.json()) as Corpo
    if (email === EMAIL_DE_TESTE) return erro(409, 'Este e-mail já tem uma conta.')
    return HttpResponse.json(
      { token: 'token-de-mentira', usuario: { ...usuario, id: 8, nome, email } },
      { status: 201 },
    )
  }),

  http.post('/api/auth/esqueci-senha', () =>
    HttpResponse.json({ mensagem: 'Se existir uma conta com esse e-mail, enviamos um link.' }),
  ),

  // O link com token=expirado faz o papel de um link vencido.
  http.post('/api/auth/redefinir-senha', async ({ request }) => {
    const { token } = (await request.json()) as Corpo
    if (token === 'expirado') return erro(410, 'Este link expirou')
    return HttpResponse.json({ mensagem: 'Senha alterada. Entre com a nova senha.' })
  }),
]
