import { useTheme } from 'styled-components'
import {
  ICONE_DO_NIVEL,
  NIVEL,
  type NivelDoTema,
  type Severidade,
} from '../../../../shared/ui/nivel'
import type { AlertaDaSemana } from '../../tipos'
import * as S from './Detalhe.styles'

export const ID_DOS_AVISOS = 'avisos-da-semana'

const ORDEM: Severidade[] = ['critico', 'atencao', 'info']

const TITULO: Record<NivelDoTema, string> = {
  critico: 'Risco para a lavoura nesta semana',
  atencao: 'Atenção nesta semana',
  ok: 'Semana tranquila para a lavoura',
}

// A resposta do "minha lavoura está bem?" logo embaixo da foto: o aviso mais sério da semana, na
// cor do nível, com o caminho para o que fazer. Os detalhes ficam em "Avisos desta semana".
export function ResumoDaSemana({ alertas }: { alertas: AlertaDaSemana[] }) {
  const tema = useTheme()
  const avisos = alertas
    .filter((alerta) => alerta.severidade !== 'info')
    .sort((a, b) => ORDEM.indexOf(a.severidade) - ORDEM.indexOf(b.severidade))
  const principal = avisos.at(0)
  const nivel = principal ? NIVEL[principal.severidade] : 'ok'
  const Icone = ICONE_DO_NIVEL[nivel]
  const outros = avisos.length - 1

  return (
    <S.Resumo $nivel={nivel} aria-label="Resumo da semana">
      <S.IconeDoResumo $nivel={nivel}>
        <Icone size={tema.icone.avisoDoDetalhe} aria-hidden />
      </S.IconeDoResumo>
      <S.TextoDoResumo>
        <strong>{TITULO[nivel]}</strong>
        <span>
          {principal
            ? principal.mensagem
            : 'Nenhum aviso de calor, frio ou chuva para os próximos 7 dias.'}
          {outros > 0 && ` E mais ${outros} ${outros === 1 ? 'aviso' : 'avisos'}.`}
        </span>
      </S.TextoDoResumo>
      {principal && <S.LinkDoResumo href={`#${ID_DOS_AVISOS}`}>Ver o que fazer</S.LinkDoResumo>}
    </S.Resumo>
  )
}
