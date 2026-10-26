import styled from 'styled-components'

export const Cartao = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[6]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.campo};

  > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.cores.destaque.base};
  }
`

export const Textos = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Cidade = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Explicacao = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
