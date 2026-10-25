import styled from 'styled-components'

export const Grupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
`

export const Rotulo = styled.label`
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Opcional = styled.span`
  font-weight: ${({ theme }) => theme.fonte.peso.medio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Entrada = styled.input<{ $comErro: boolean }>`
  height: ${({ theme }) => theme.altura.campo};
  padding: 0 ${({ theme }) => theme.espaco[8]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.campo};
  color: ${({ theme }) => theme.cores.texto.principal};
  background: ${({ theme }) => theme.cores.fundo.campo};
  border: ${({ theme, $comErro }) =>
    $comErro
      ? `${theme.espessura.bordaDeErro} solid ${theme.cores.erro}`
      : `${theme.espessura.borda} solid ${theme.cores.borda.campo}`};
  border-radius: ${({ theme }) => theme.raio.campo};

  &:read-only {
    color: ${({ theme }) => theme.cores.texto.secundario};
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
    border-color: ${({ theme }) => theme.cores.borda.cartao};
  }
`

export const Erro = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
  color: ${({ theme }) => theme.cores.erro};
`

export const Dica = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
