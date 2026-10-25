import { dataCompleta, diaEMes, hoje } from '../../../../shared/formato/data'
import { porcentagemDoCiclo } from '../../detalhe'
import type { DetalheDaLavoura } from '../../tipos'
import * as S from './Detalhe.styles'

// "Dia 45 de 120" com a barra, ou "Safra 2026/27" na lavoura perene.
export function Ciclo({ lavoura }: { lavoura: DetalheDaLavoura }) {
  const { diaAtual, cicloDias, safra, colheitaPrevista } = lavoura

  if (diaAtual !== null && cicloDias !== null) {
    const feito = porcentagemDoCiclo(diaAtual, cicloDias)
    // Na colheita contínua (morango, chuchu), a data é quando a colheita começa.
    const colheita =
      lavoura.tipoCiclo === 'continua'
        ? `Colheita a partir de ${diaEMes(colheitaPrevista)}`
        : `Colheita prevista: ${diaEMes(colheitaPrevista)}`
    return (
      <S.Ciclo>
        <S.LinhaDoCiclo>
          <strong>
            Dia {diaAtual} de {cicloDias}
          </strong>
          <span>{colheita}</span>
        </S.LinhaDoCiclo>
        <S.Barra role="img" aria-label={`${feito}% do ciclo concluído`}>
          <S.Preenchida style={{ width: `${feito}%` }} />
        </S.Barra>
      </S.Ciclo>
    )
  }

  // Perene sem safra (banana, goiaba): depois da primeira colheita, produz direto.
  const jaProduz = !safra && colheitaPrevista <= hoje()

  return (
    <S.Ciclo>
      <S.LinhaDoCiclo>
        <strong>{safra ? `Safra ${safra}` : lavoura.cultura}</strong>
        <span>
          {jaProduz
            ? `Produzindo desde ${dataCompleta(colheitaPrevista)}`
            : `Colheita a partir de ${dataCompleta(colheitaPrevista)}`}
        </span>
      </S.LinhaDoCiclo>
      {lavoura.explicacaoCiclo && <S.Explicacao>{lavoura.explicacaoCiclo}</S.Explicacao>}
    </S.Ciclo>
  )
}
