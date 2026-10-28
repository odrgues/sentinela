import { Check } from 'lucide-react'
import { useId, useState } from 'react'
import { useTheme } from 'styled-components'
import { diaDaSemana, diaEMes } from '../../../../shared/formato/data'
import { ICONE_DO_NIVEL, NIVEL, NOME_DO_NIVEL } from '../../../../shared/ui/nivel'
import type { AlertaDaSemana } from '../../tipos'
import * as S from './Detalhe.styles'
import { ID_DOS_AVISOS } from './ResumoDaSemana'

// aoOlhar: o dia do aviso que a pessoa está olhando (com o mouse ou o teclado), para acender o
// mesmo dia no gráfico; null quando ela sai.
type AoOlhar = (data: string | null) => void

function Aviso({ alerta, aoOlhar }: { alerta: AlertaDaSemana; aoOlhar?: AoOlhar }) {
  const tema = useTheme()
  const id = useId()
  const [aberto, setAberto] = useState(false)
  const nivel = NIVEL[alerta.severidade]
  const Icone = ICONE_DO_NIVEL[nivel]

  return (
    <S.Aviso
      $nivel={nivel}
      onMouseEnter={() => aoOlhar?.(alerta.data)}
      onMouseLeave={() => aoOlhar?.(null)}
      onFocus={() => aoOlhar?.(alerta.data)}
      onBlur={() => aoOlhar?.(null)}
    >
      {/* O dia do aviso em destaque: "quarta" e "28/10". */}
      <S.DiaDoAviso $nivel={nivel}>
        <span>{diaDaSemana(alerta.data)}</span>
        <strong>{diaEMes(alerta.data)}</strong>
      </S.DiaDoAviso>
      <S.TopoDoAviso>
        <Icone size={tema.icone.avisoDoDetalhe} aria-hidden />
        <div>
          <strong>{NOME_DO_NIVEL[nivel]}</strong>
          <S.CorpoDoAviso $nivel={nivel}>{alerta.mensagem}</S.CorpoDoAviso>
        </div>
      </S.TopoDoAviso>
      {alerta.oQueFazer && (
        <S.OQueFazer $nivel={nivel}>
          <strong>O que fazer</strong>
          {alerta.oQueFazer}
        </S.OQueFazer>
      )}
      {alerta.porque && (
        <>
          <S.PorQue
            type="button"
            aria-expanded={aberto}
            aria-controls={id}
            onClick={() => setAberto(!aberto)}
          >
            Por quê?
          </S.PorQue>
          {aberto && (
            <S.Explicado id={id} $nivel={nivel}>
              {alerta.porque}
            </S.Explicado>
          )}
        </>
      )}
    </S.Aviso>
  )
}

export function AvisosDaSemana({
  alertas,
  aoOlhar,
}: {
  alertas: AlertaDaSemana[]
  aoOlhar?: AoOlhar
}) {
  const tema = useTheme()

  return (
    <S.Secao id={ID_DOS_AVISOS}>
      <h2>Avisos desta semana</h2>
      {alertas.length === 0 ? (
        <S.Aviso $nivel="ok">
          <S.TopoDoAviso>
            <Check size={tema.icone.avisoDoDetalhe} aria-hidden />
            <div>
              <strong>Tudo certo esta semana</strong>
              <S.CorpoDoAviso $nivel="ok">
                Temperatura e chuva dentro do que a lavoura aguenta nos próximos 7 dias.
              </S.CorpoDoAviso>
            </div>
          </S.TopoDoAviso>
        </S.Aviso>
      ) : (
        alertas.map((alerta) => (
          <Aviso key={`${alerta.tipo}-${alerta.data}`} alerta={alerta} aoOlhar={aoOlhar} />
        ))
      )}
    </S.Secao>
  )
}
