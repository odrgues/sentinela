import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { servidor } from '../../mocks/servidor'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'
import { telaDeComputador } from '../../test/tela'
import { MENSAGENS } from '../api/erros'
import { lerToken } from '../api/sessao'

describe('Casca', () => {
  it('no computador, mostra o menu com a tela atual marcada e a inicial de quem entrou', async () => {
    telaDeComputador()
    jaEntrou()
    abrirApp('/')

    const menu = await screen.findByRole('navigation', { name: 'Principal' })
    expect(menu).toHaveTextContent('Painel')
    expect(screen.getByRole('link', { name: 'Painel' })).toHaveAttribute('aria-current', 'page')
    expect(await screen.findByText('J')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Minha conta' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Minha conta' })).toBeInTheDocument()
  })

  it('no celular, não tem a barra do topo', async () => {
    jaEntrou()
    abrirApp('/')

    await screen.findByRole('heading', { level: 1, name: /, João$/ })
    expect(screen.queryByRole('navigation', { name: 'Principal' })).not.toBeInTheDocument()
  })

  it('quando o token vence, apaga o token e volta para o login com o aviso', async () => {
    telaDeComputador()
    jaEntrou()
    servidor.use(
      http.get('/api/usuario/me', () =>
        HttpResponse.json({ status: 401, mensagem: 'Token vencido' }, { status: 401 }),
      ),
    )
    const roteador = abrirApp('/')

    expect(await screen.findByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/entrar')
    expect(screen.getByRole('alert')).toHaveTextContent(MENSAGENS.sessaoExpirada)
    expect(lerToken()).toBeNull()
  })
})
