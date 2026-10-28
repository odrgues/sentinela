import { dataCompleta, diaEMes, hoje } from '../../../../shared/formato/data'
import { porcentagemDoCiclo } from '../../detalhe'
import type { DetalheDaLavoura, TrechoDoCiclo } from '../../tipos'
import * as S from './Detalhe.styles'

// O ciclo dividido nas fases da cultura: as que já passaram cheias, a de agora até hoje e as
// próximas vazias. Embaixo, a próxima fase. Passar o mouse num trecho mostra o nome da fase.
function LinhaDoTempo({
  fases,
  diaAtual,
  cicloDias,
}: {
  fases: TrechoDoCiclo[]
  diaAtual: number
  cicloDias: number
}) {
  const feito = porcentagemDoCiclo(diaAtual, cicloDias)
  const proxima = fases.find((fase) => fase.diaInicio > diaAtual)

  return (
    <>
      <S.Trechos role="img" aria-label={`${feito}% do ciclo concluído`}>
        {fases.map((fase) => {
          const dias = fase.diaFim - fase.diaInicio + 1
          const cheio = Math.min(100, Math.max(0, ((diaAtual - fase.diaInicio + 1) / dias) * 100))
          const agora = diaAtual >= fase.diaInicio && diaAtual <= fase.diaFim
          return (
            <S.Trecho
              key={fase.nome}
              $agora={agora}
              style={{ flexGrow: dias }}
              title={`${fase.nome} · dias ${fase.diaInicio} a ${fase.diaFim}`}
            >
              <S.Preenchida style={{ width: `${cheio}%` }} />
            </S.Trecho>
          )
        })}
      </S.Trechos>
      {proxima && (
        <S.Explicacao>
          Depois: {proxima.nome}, a partir do dia {proxima.diaInicio}
        </S.Explicacao>
      )}
    </>
  )
}

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
        {lavoura.fases?.length ? (
          <LinhaDoTempo fases={lavoura.fases} diaAtual={diaAtual} cicloDias={cicloDias} />
        ) : (
          <S.Barra role="img" aria-label={`${feito}% do ciclo concluído`}>
            <S.Preenchida style={{ width: `${feito}%` }} />
          </S.Barra>
        )}
        <S.Explicacao>Plantada em {diaEMes(lavoura.dataPlantio)}</S.Explicacao>
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
