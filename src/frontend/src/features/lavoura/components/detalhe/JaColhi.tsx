import { Wheat } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTheme } from 'styled-components'
import { AvisoDeErro } from '../../../../shared/ui/AvisoDeErro'
import { Botao } from '../../../../shared/ui/Botao'
import { Confirmacao } from '../../../../shared/ui/Confirmacao'
import { useEncerrarLavoura } from '../../api'
import * as S from './Detalhe.styles'

// O botão "Já colhi" e a confirmação, com a saída "A lavoura foi perdida".
export function JaColhi({ id, apelido }: { id: string; apelido: string }) {
  const tema = useTheme()
  const encerrar = useEncerrarLavoura(id)
  const [aberta, setAberta] = useState(false)
  const fechar = useCallback(() => setAberta(false), [])

  return (
    <>
      <Botao variante="neutro" onClick={() => setAberta(true)}>
        Já colhi
      </Botao>
      {aberta && (
        <Confirmacao
          titulo={`Já colheu o ${apelido}?`}
          nivel="ok"
          icone={<Wheat size={tema.icone.confirmacao} aria-hidden />}
          aoFechar={fechar}
          acoes={
            <>
              {encerrar.error && <AvisoDeErro titulo={encerrar.error.message} />}
              <Botao onClick={() => encerrar.mutate('colhido')} disabled={encerrar.isPending}>
                {encerrar.isPending ? 'Salvando…' : 'Sim, já colhi'}
              </Botao>
              <Botao variante="neutro" onClick={fechar}>
                Cancelar
              </Botao>
              <S.LinkDiscreto
                type="button"
                onClick={() => encerrar.mutate('perdido')}
                disabled={encerrar.isPending}
              >
                A lavoura foi perdida
              </S.LinkDiscreto>
            </>
          }
        >
          <p>A lavoura sai do painel e para de receber avisos. O histórico continua guardado.</p>
        </Confirmacao>
      )}
    </>
  )
}
