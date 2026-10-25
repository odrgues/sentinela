import { dataCompleta, diaEMes } from '../../../../shared/formato/data'
import { porcentagemDoCiclo } from '../../detalhe'
import type { DetalheDaLavoura } from '../../tipos'
import * as S from './Detalhe.styles'

// "Dia 45 de 120" com a barra, ou "Safra 2026/27" na lavoura perene.
export function Ciclo({ lavoura }: { lavoura: DetalheDaLavoura }) {
  const { diaAtual, cicloDias, safra, colheitaPrevista } = lavoura

  if (diaAtual !== null && cicloDias !== null) {
    const feito = porcentagemDoCiclo(diaAtual, cicloDias)
    return (
      <S.Ciclo>
        <S.LinhaDoCiclo>
          <strong>
            Dia {diaAtual} de {cicloDias}
          </strong>
          <span>Colheita prevista: {diaEMes(colheitaPrevista)}</span>
        </S.LinhaDoCiclo>
        <S.Barra role="img" aria-label={`${feito}% do ciclo concluído`}>
          <S.Preenchida style={{ width: `${feito}%` }} />
        </S.Barra>
      </S.Ciclo>
    )
  }

  return (
    <S.Ciclo>
      <S.LinhaDoCiclo>
        <strong>{safra ? `Safra ${safra}` : lavoura.cultura}</strong>
        <span>Colheita a partir de {dataCompleta(colheitaPrevista)}</span>
      </S.LinhaDoCiclo>
      {lavoura.tipoCiclo === 'perene' && (
        <S.Explicacao>
          Primavera é a época da florada. A colheita vai de maio a agosto.
        </S.Explicacao>
      )}
    </S.Ciclo>
  )
}
