import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { EMAIL_DE_TESTE, SENHA_DE_TESTE } from '../../mocks/dados/usuario'
import { servidor } from '../../mocks/servidor'
import { MENSAGENS } from '../../shared/api/erros'
import { lerToken } from '../../shared/api/sessao'
import { abrirApp } from '../../test/abrirApp'

async function preencher(email: string, senha: string) {
  await screen.findByRole('heading', { level: 1, name: 'Entrar' })
  if (email) await userEvent.type(screen.getByLabelText('E-mail'), email)
  if (senha) await userEvent.type(screen.getByLabelText('Senha'), senha)
  await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('Entrar', () => {
  it('com e-mail e senha certos, guarda o token e abre o painel', async () => {
    const roteador = abrirApp('/entrar')

    await preencher(EMAIL_DE_TESTE, SENHA_DE_TESTE)

    expect(await screen.findByRole('heading', { level: 1, name: /, João$/ })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/')
    expect(lerToken()).toBe('token-de-mentira')
  })

  it('com a senha errada, mostra a caixa de erro e não entra', async () => {
    abrirApp('/entrar')

    await preencher(EMAIL_DE_TESTE, 'senha-errada')

    const aviso = await screen.findByRole('alert')
    expect(aviso).toHaveTextContent('E-mail ou senha incorretos')
    expect(aviso).toHaveTextContent('Esqueci minha senha')
    expect(lerToken()).toBeNull()
  })

  it('com os campos vazios, avisa embaixo de cada um sem chamar a API', async () => {
    abrirApp('/entrar')

    await preencher('', '')

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription('Digite seu e-mail.')
    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription('Digite sua senha.')
    expect(screen.getByLabelText('Senha')).toBeInvalid()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('sem internet, mostra a mensagem de sem conexão', async () => {
    servidor.use(http.post('/api/auth/login', () => HttpResponse.error()))
    abrirApp('/entrar')

    await preencher(EMAIL_DE_TESTE, SENHA_DE_TESTE)

    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGENS.semConexao)
  })

  it('mostra a mensagem que veio de outra tela', async () => {
    abrirApp({
      pathname: '/entrar',
      state: { mensagem: 'Senha alterada. Entre com a nova senha.' },
    })

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Senha alterada. Entre com a nova senha.',
    )
  })

  it('leva para o cadastro e para o esqueci a senha', async () => {
    abrirApp('/entrar')

    expect(await screen.findByRole('link', { name: 'Criar conta' })).toHaveAttribute(
      'href',
      '/cadastro',
    )
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute(
      'href',
      '/esqueci-senha',
    )
  })
})
