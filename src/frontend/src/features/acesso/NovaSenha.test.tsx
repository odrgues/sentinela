import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { lerToken } from '../../shared/api/sessao'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'

async function salvar(senha: string, repetida: string) {
  await screen.findByRole('heading', { level: 1, name: 'Crie uma senha nova' })
  if (senha) await userEvent.type(screen.getByLabelText('Nova senha'), senha)
  if (repetida) await userEvent.type(screen.getByLabelText('Repita a nova senha'), repetida)
  await userEvent.click(screen.getByRole('button', { name: 'Salvar nova senha' }))
}

describe('Criar nova senha', () => {
  it('salva, sai da conta e volta para o login com a mensagem', async () => {
    jaEntrou()
    const roteador = abrirApp('/nova-senha?token=abc')

    await salvar('nova-senha', 'nova-senha')

    expect(await screen.findByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/entrar')
    expect(screen.getByRole('status')).toHaveTextContent('Senha alterada. Entre com a nova senha.')
    expect(lerToken()).toBeNull()
  })

  it('avisa quando as senhas não são iguais', async () => {
    abrirApp('/nova-senha?token=abc')

    await salvar('nova-senha', 'outra-senha')

    expect(screen.getByLabelText('Repita a nova senha')).toHaveAccessibleDescription(
      'As senhas não são iguais.',
    )
  })

  it('avisa quando a senha é curta', async () => {
    abrirApp('/nova-senha?token=abc')

    await salvar('123', '123')

    expect(screen.getByLabelText('Nova senha')).toBeInvalid()
  })

  it('com o link vencido, mostra que expirou e deixa pedir outro', async () => {
    abrirApp('/nova-senha?token=expirado')

    await salvar('nova-senha', 'nova-senha')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Este link expirou' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pedir outro link' })).toHaveAttribute(
      'href',
      '/esqueci-senha',
    )
  })

  it('sem token no endereço, o link já aparece como expirado', async () => {
    abrirApp('/nova-senha')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Este link expirou' }),
    ).toBeInTheDocument()
  })
})
