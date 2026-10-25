import styled from 'styled-components'
import { noCelular, noComputador } from '../../../styles/midia'

export const Tela = styled.div`
  min-height: 100dvh;
  display: flex;

  ${noCelular} {
    flex-direction: column;
  }
`

export const LadoDaFaixa = styled.div`
  flex: 1 1 ${({ theme }) => theme.largura.faixa};
  display: flex;
  flex-direction: column;

  > * {
    flex-grow: 1;
  }

  ${noCelular} {
    display: none;
  }
`

export const TopoNoCelular = styled.div`
  ${noComputador} {
    display: none;
  }
`

export const LadoDoFormulario = styled.main`
  flex: 1 1 ${({ theme }) => theme.largura.colunaDoFormulario};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco[14]} ${({ theme }) => theme.espaco[11]};

  ${noCelular} {
    flex-grow: 1;
    align-items: stretch;
    padding: ${({ theme }) => theme.espaco[12]} ${({ theme }) => theme.espaco[11]}
      ${({ theme }) => theme.espaco[11]};
  }
`

export const Coluna = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.formulario};
  display: flex;
  flex-direction: column;
`
