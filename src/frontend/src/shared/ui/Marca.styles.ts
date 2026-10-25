import styled, { css } from 'styled-components'

export const Marca = styled.span<{ $sobreVerde: boolean; $grande: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme, $grande }) => ($grande ? theme.espaco[6] : theme.espaco[3])};
  font-size: ${({ theme, $grande }) =>
    $grande ? theme.fonte.tamanho.marca : theme.fonte.tamanho.secao};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  letter-spacing: ${({ theme }) => theme.fonte.espacamentoDaMarca};

  ${({ theme, $sobreVerde }) =>
    $sobreVerde
      ? css`
          color: ${theme.cores.texto.sobreDestaque};

          svg {
            color: ${theme.cores.marca.sol};
          }
        `
      : css`
          color: ${theme.cores.destaque.base};
        `}
`
