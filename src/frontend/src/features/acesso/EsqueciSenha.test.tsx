import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { abrirApp } from '../../test/abrirApp'

afterEach(() => {
  vi.useRealTimers()
})

async function pedirLink(email: string) {
  await screen.findByRole('heading', { level: 1, name: 'Esqueceu a senha?' })
  if (email) await userEvent.type(screen.getByLabelText('E-mail'), email)
  await userEvent.click(screen.getByRole('button', { name: 'Enviar link' }))
}

describe('Esqueci minha senha', () => {
  it('manda o link e mostra para qual e-mail foi', async () => {
    abrirApp('/esqueci-senha')

    await pedirLink('joao@exemplo.com')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Confira seu e-mail' }),
    ).toBeInTheDocument()
    expect(screen.getByText('joao@exemplo.com')).toBeInTheDocument()
  })

  it('sem e-mail, avisa embaixo do campo', async () => {
    abrirApp('/esqueci-senha')

    await pedirLink('')

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'Digite o e-mail da sua conta.',
    )
  })

  it('volta do "confira seu e-mail" para o formulário', async () => {
    abrirApp('/esqueci-senha')
    await pedirLink('joao@exemplo.com')

    await userEvent.click(await screen.findByRole('button', { name: 'Voltar' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Esqueceu a senha?' })).toBeInTheDocument()
  })

  it('pede de novo, e só deixa pedir outra vez depois de 1 minuto', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const usuario = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    abrirApp('/esqueci-senha')
    await pedirLink('joao@exemplo.com')

    await usuario.click(await screen.findByRole('button', { name: 'Enviar de novo' }))

    const esperando = await screen.findByRole('button', {
      name: 'Enviamos de novo. Aguarde 1 minuto para pedir outro.',
    })
    expect(esperando).toBeDisabled()

    await act(() => vi.advanceTimersByTimeAsync(60 * 1000))
    expect(screen.getByRole('button', { name: 'Enviar de novo' })).toBeEnabled()
  })
})
