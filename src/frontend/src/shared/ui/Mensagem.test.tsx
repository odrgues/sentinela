import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProvedorDeTema } from '../../styles/ProvedorDeTema'
import { Mensagem, TEMPO_DA_MENSAGEM } from './Mensagem'

afterEach(() => {
  vi.useRealTimers()
})

describe('Mensagem', () => {
  it('aparece e some sozinha depois de 4 segundos', () => {
    vi.useFakeTimers()
    render(
      <ProvedorDeTema>
        <Mensagem texto="Lavoura salva!" />
      </ProvedorDeTema>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Lavoura salva!')

    act(() => vi.advanceTimersByTime(TEMPO_DA_MENSAGEM))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
