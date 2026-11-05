import { Check, ChevronDown, Lightbulb } from 'lucide-react'
import { useId, useState } from 'react'
import { useTheme } from 'styled-components'
import { diaDaSemana, diaEMes } from '../../../../shared/formato/data'
import { ICONE_DO_NIVEL, NIVEL, NOME_DO_NIVEL } from '../../../../shared/ui/nivel'
import { agruparAvisos, tituloDoAviso, type GrupoDeAvisos } from '../../detalhe'
import type { AlertaDaSemana } from '../../tipos'
import * as S from './Detalhe.styles'
import { ID_DOS_AVISOS } from './ResumoDaSemana'

// aoOlhar: o dia do aviso que a pessoa está olhando (com o mouse ou o teclado), para acender o
// mesmo dia no gráfico; null quando ela sai.
type AoOlhar = (data: string | null) => void

// Um dia do aviso, com o "por quê?" que abre a explicação.
function LinhaDoAviso({ alerta, aoOlhar }: { alerta: AlertaDaSemana; aoOlhar?: AoOlhar }) {
  const tema = useTheme()
  const id = useId()
  const [aberto, setAberto] = useState(false)
  const nivel = NIVEL[alerta.severidade]

  return (
    <S.LinhaDoAviso
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
      <S.TextoDoAviso>
        <S.CorpoDoAviso>{alerta.mensagem}</S.CorpoDoAviso>
        {alerta.porque && (
          <>
            <S.PorQue
              type="button"
              aria-expanded={aberto}
              aria-controls={id}
              onClick={() => setAberto(!aberto)}
            >
              Por quê?
              <ChevronDown size={tema.icone.selo} aria-hidden />
            </S.PorQue>
            {aberto && <S.Explicado id={id}>{alerta.porque}</S.Explicado>}
          </>
        )}
      </S.TextoDoAviso>
    </S.LinhaDoAviso>
  )
}

// Um tipo de aviso: o título, uma linha por dia e o "O que fazer" uma vez só, embaixo.
function Grupo({ grupo, aoOlhar }: { grupo: GrupoDeAvisos; aoOlhar?: AoOlhar }) {
  const tema = useTheme()
  const Icone = ICONE_DO_NIVEL[grupo.nivel]

  return (
    <S.GrupoDeAvisos $nivel={grupo.nivel}>
      <S.TopoDoGrupo>
        <S.ChipDoNivel $nivel={grupo.nivel}>
          <Icone size={tema.icone.avisoDoDetalhe} aria-hidden />
        </S.ChipDoNivel>
        <S.TituloDoGrupo $nivel={grupo.nivel}>
          <span>{NOME_DO_NIVEL[grupo.nivel]}</span>
          <h3>{tituloDoAviso(grupo.tipo, grupo.nivel)}</h3>
        </S.TituloDoGrupo>
        {grupo.alertas.length > 1 && <S.QuantosDias>{grupo.alertas.length} dias</S.QuantosDias>}
      </S.TopoDoGrupo>
      <S.LinhasDoGrupo>
        {grupo.alertas.map((alerta) => (
          <LinhaDoAviso key={alerta.data} alerta={alerta} aoOlhar={aoOlhar} />
        ))}
      </S.LinhasDoGrupo>
      {grupo.oQueFazer && (
        <S.OQueFazer $nivel={grupo.nivel}>
          <span>
            <Lightbulb size={tema.icone.botao} aria-hidden />
          </span>
          <div>
            <strong>O que fazer</strong>
            {grupo.oQueFazer}
          </div>
        </S.OQueFazer>
      )}
    </S.GrupoDeAvisos>
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
        <S.GrupoDeAvisos $nivel="ok">
          <S.TopoDoGrupo>
            <S.ChipDoNivel $nivel="ok">
              <Check size={tema.icone.avisoDoDetalhe} aria-hidden />
            </S.ChipDoNivel>
            <S.TituloDoGrupo $nivel="ok">
              <span>{NOME_DO_NIVEL.ok}</span>
              <h3>Tudo certo esta semana</h3>
            </S.TituloDoGrupo>
          </S.TopoDoGrupo>
          <S.CorpoDoAviso>
            Temperatura e chuva dentro do que a lavoura aguenta nos próximos 7 dias.
          </S.CorpoDoAviso>
        </S.GrupoDeAvisos>
      ) : (
        agruparAvisos(alertas).map((grupo) => (
          <Grupo key={grupo.chave} grupo={grupo} aoOlhar={aoOlhar} />
        ))
      )}
    </S.Secao>
  )
}
