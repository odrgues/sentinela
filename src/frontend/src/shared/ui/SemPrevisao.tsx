import { WifiOff } from 'lucide-react'
import { useTheme } from 'styled-components'
import { quandoFoi } from '../formato/data'
import * as S from './SemPrevisao.styles'

// Quando a Open-Meteo falhou: os avisos são os da última busca que deu certo.
export function SemPrevisao({ atualizadaEm }: { atualizadaEm: string }) {
  const tema = useTheme()

  return (
    <S.SemPrevisao role="status">
      <WifiOff size={tema.icone.aviso} aria-hidden />
      <div>
        <strong>Não conseguimos atualizar a previsão</strong>
        <span>
          Mostrando os avisos de {quandoFoi(atualizadaEm)}. Tentamos de novo daqui a pouco.
        </span>
      </div>
    </S.SemPrevisao>
  )
}
