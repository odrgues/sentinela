import { CalendarCheck, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTheme } from 'styled-components'
import { dataCompleta, diaEMes, hoje } from '../../../../shared/formato/data'
import { SoParaLeitor } from '../../../../shared/ui/SoParaLeitor'
import { diasQueFaltam, porcentagemDoCiclo } from '../../detalhe'
import type { DetalheDaLavoura, TrechoDoCiclo } from '../../tipos'
import * as S from './Detalhe.styles'

// O ciclo dividido nas fases da cultura: as que já passaram cheias, a de agora até hoje, com o
// ponto de "você está aqui", e as próximas vazias. Embaixo, a próxima fase. Passar o mouse num
// trecho mostra o nome da fase.
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
              style={{ flexGrow: dias }}
              title={`${fase.nome} · dias ${fase.diaInicio} a ${fase.diaFim}`}
            >
              <S.TrilhoDoTrecho>
                <S.Preenchida $agora={agora} style={{ width: `${cheio}%` }} />
              </S.TrilhoDoTrecho>
              {agora && <S.MarcadorDeHoje aria-hidden style={{ left: `${cheio}%` }} />}
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

// "Colheita prevista" e a data em número grande. Quem usa leitor de tela ouve a frase inteira, e
// não as duas metades.
function DataDaColheita({
  frase,
  data,
  leitura,
  faltam,
}: {
  frase: string
  data: string
  leitura: string
  faltam?: string
}) {
  return (
    <S.Colheita>
      <S.TextoDaColheita>
        <span aria-hidden>{frase}</span>
        <S.DataDaColheita aria-hidden>{data}</S.DataDaColheita>
        <SoParaLeitor>{leitura}</SoParaLeitor>
      </S.TextoDaColheita>
      {faltam && <S.Faltam>{faltam}</S.Faltam>}
    </S.Colheita>
  )
}

function Rotulo({ icone: Icone, children }: { icone: LucideIcon; children: ReactNode }) {
  const tema = useTheme()
  return (
    <S.RotuloDoCiclo>
      <Icone size={tema.icone.selo} aria-hidden />
      {children}
    </S.RotuloDoCiclo>
  )
}

// A data da colheita em destaque, a linha do tempo do ciclo e "Dia 45 de 120", ou "Safra 2026/27"
// na lavoura perene. A fase de agora (children) fica embaixo, dentro do mesmo cartão.
export function Ciclo({ lavoura, children }: { lavoura: DetalheDaLavoura; children?: ReactNode }) {
  const { diaAtual, cicloDias, safra, colheitaPrevista } = lavoura

  if (diaAtual !== null && cicloDias !== null) {
    const feito = porcentagemDoCiclo(diaAtual, cicloDias)
    const faltam = diasQueFaltam(diaAtual, cicloDias)
    // Na colheita contínua (morango, chuchu), a data é quando a colheita começa.
    const continua = lavoura.tipoCiclo === 'continua'
    const frase = continua ? 'Colheita a partir de' : 'Colheita prevista'
    const data = diaEMes(colheitaPrevista)
    return (
      <S.Ciclo>
        <Rotulo icone={CalendarCheck}>Ciclo da lavoura</Rotulo>
        <DataDaColheita
          frase={frase}
          data={data}
          leitura={continua ? `${frase} ${data}` : `${frase}: ${data}`}
          faltam={
            faltam === 0 ? 'Já no ponto' : `Faltam ${faltam} ${faltam === 1 ? 'dia' : 'dias'}`
          }
        />
        {lavoura.fases?.length ? (
          <LinhaDoTempo fases={lavoura.fases} diaAtual={diaAtual} cicloDias={cicloDias} />
        ) : (
          <S.Barra role="img" aria-label={`${feito}% do ciclo concluído`}>
            <S.Preenchida $agora style={{ width: `${feito}%` }} />
          </S.Barra>
        )}
        <S.LinhaDoCiclo>
          <strong>
            Dia {diaAtual} de {cicloDias}
          </strong>
          <span>Plantada em {diaEMes(lavoura.dataPlantio)}</span>
        </S.LinhaDoCiclo>
        {children}
      </S.Ciclo>
    )
  }

  // Perene sem safra (banana, goiaba): depois da primeira colheita, produz direto.
  const jaProduz = !safra && colheitaPrevista <= hoje()

  return (
    <S.Ciclo>
      <Rotulo icone={CalendarCheck}>Ciclo da lavoura</Rotulo>
      <S.TituloDaPerene>{safra ? `Safra ${safra}` : lavoura.cultura}</S.TituloDaPerene>
      <S.LinhaDoCiclo>
        <span>
          {jaProduz
            ? `Produzindo desde ${dataCompleta(colheitaPrevista)}`
            : `Colheita a partir de ${dataCompleta(colheitaPrevista)}`}
        </span>
      </S.LinhaDoCiclo>
      {lavoura.explicacaoCiclo && <S.Explicacao>{lavoura.explicacaoCiclo}</S.Explicacao>}
      {children}
    </S.Ciclo>
  )
}
