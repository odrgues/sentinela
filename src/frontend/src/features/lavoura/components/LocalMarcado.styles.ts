import styled from 'styled-components'

export const Cartao = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
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
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Explicacao = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Trocar = styled.button`
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[3]};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.destaque.base};
  text-decoration: underline;
  cursor: pointer;
`
