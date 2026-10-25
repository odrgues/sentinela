import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'

const TELAS_DE_ACESSO = [
  ['/entrar', 'Entrar'],
  ['/cadastro', 'Criar conta'],
  ['/esqueci-senha', 'Esqueceu a senha?'],
  ['/nova-senha?token=abc', 'Crie uma senha nova'],
]

const TELAS_DE_QUEM_ENTROU: [string, string | RegExp][] = [
  ['/', /, João$/],
  ['/lavouras/nova', 'Onde fica sua lavoura?'],
  ['/lavouras/1', 'Talhão do fundo'],
  ['/lavouras/1/editar', 'Editar lavoura'],
  ['/conta', 'Minha conta'],
]

describe('rotas', () => {
  it.each(TELAS_DE_ACESSO)('%s abre a tela %s', async (caminho, titulo) => {
    abrirApp(caminho)

    expect(await screen.findByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
  })

  it.each(TELAS_DE_QUEM_ENTROU)('%s abre a tela %s para quem entrou', async (caminho, titulo) => {
    jaEntrou()
    abrirApp(caminho)

    expect(await screen.findByRole('heading', { level: 1, name: titulo })).toBeInTheDocument()
  })

  it.each(TELAS_DE_QUEM_ENTROU)('%s manda para o login quem não entrou', async (caminho) => {
    const roteador = abrirApp(caminho)

    expect(await screen.findByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/entrar')
  })

  it.each(['/entrar', '/cadastro', '/esqueci-senha'])(
    '%s manda para o painel quem já entrou',
    async (caminho) => {
      jaEntrou()
      const roteador = abrirApp(caminho)

      expect(await screen.findByRole('heading', { level: 1, name: /, João$/ })).toBeInTheDocument()
      expect(roteador.state.location.pathname).toBe('/')
    },
  )

  it('a nova senha abre mesmo para quem já entrou', async () => {
    jaEntrou()
    abrirApp('/nova-senha?token=abc')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Crie uma senha nova' }),
    ).toBeInTheDocument()
  })

  it('um endereço que não existe mostra a página não encontrada, com volta para o painel', async () => {
    jaEntrou()
    const roteador = abrirApp('/nao-existe')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Página não encontrada' }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Voltar para o painel' }))
    expect(roteador.state.location.pathname).toBe('/')
  })
})
