import { useTheme } from 'styled-components'
import * as S from './Painel.styles'

// Cinza pulsando no lugar do clima e das lavouras, enquanto o GET /api/painel não volta.
export function Carregando() {
  const { altura, largura } = useTheme()

  return (
    <S.Carregando role="status" aria-label="Carregando suas lavouras">
      <S.Bloco $largura={largura.carregandoCurto} $altura={altura.carregandoTitulo} />
      <S.Bloco $altura={altura.carregandoLinha} />
      <S.Bloco $largura="70%" $altura={altura.carregandoLinha} />
      <S.Bloco $largura={largura.carregandoMedio} $altura={altura.carregandoLinha} />
      <S.Bloco $altura={altura.carregandoCartao} $suave />
      <S.Bloco $altura={altura.carregandoCartao} $suave />
      <p>Buscando a previsão das suas lavouras…</p>
    </S.Carregando>
  )
}
