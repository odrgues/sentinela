import { Check } from 'lucide-react'
import { useId, useState } from 'react'
import { useTheme } from 'styled-components'
import { diaDaSemana, diaEMes } from '../../../../shared/formato/data'
import { ICONE_DO_NIVEL, NIVEL, NOME_DO_NIVEL } from '../../../../shared/ui/nivel'
import type { AlertaDaSemana } from '../../tipos'
import * as S from './Detalhe.styles'

function Aviso({ alerta }: { alerta: AlertaDaSemana }) {
  const tema = useTheme()
  const id = useId()
  const [aberto, setAberto] = useState(false)
  const nivel = NIVEL[alerta.severidade]
  const Icone = ICONE_DO_NIVEL[nivel]

  return (
    <S.Aviso $nivel={nivel}>
      <S.TopoDoAviso>
        <Icone size={tema.icone.avisoDoDetalhe} aria-hidden />
        <div>
          <strong>
            {NOME_DO_NIVEL[nivel]} · {diaDaSemana(alerta.data)}, {diaEMes(alerta.data)}
          </strong>
          <S.CorpoDoAviso $nivel={nivel}>{alerta.mensagem}</S.CorpoDoAviso>
        </div>
      </S.TopoDoAviso>
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

export function AvisosDaSemana({ alertas }: { alertas: AlertaDaSemana[] }) {
  const tema = useTheme()

  return (
    <S.Secao>
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
        alertas.map((alerta) => <Aviso key={`${alerta.tipo}-${alerta.data}`} alerta={alerta} />)
      )}
    </S.Secao>
  )
}
