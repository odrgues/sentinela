import styled from 'styled-components'

export const Caixa = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.nivel.critico.fundo};
  border-radius: ${({ theme }) => theme.raio.campo};
  color: ${({ theme }) => theme.cores.nivel.critico.texto};

  svg {
    flex-shrink: 0;
  }
`

export const Textos = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};
`

export const Titulo = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`

export const Texto = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.nivel.critico.corpo};
`
