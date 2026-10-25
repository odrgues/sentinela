import styled from 'styled-components'
import { noCelular } from '../../../styles/midia'

export const Tela = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco[14]} ${({ theme }) => theme.espaco[11]};

  ${noCelular} {
    align-items: stretch;
    padding: 0;
  }
`

// No computador, o conteúdo do celular num cartão centralizado.
export const Cartao = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.cartaoCentral};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[11]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};

  ${noCelular} {
    max-width: none;
    background: none;
    border: none;
    border-radius: 0;
  }
`
