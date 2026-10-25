import styled from 'styled-components'

export const SemPrevisao = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  background: ${({ theme }) => theme.cores.fundo.semPrevisao};
  border-radius: ${({ theme }) => theme.raio.campo};
  color: ${({ theme }) => theme.cores.texto.semPrevisao};

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }
`
