import styled from 'styled-components'
import { noCelular } from '../../../styles/midia'

export const Faixa = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[11]};
  min-height: ${({ theme }) => theme.altura.faixaDoComputador};
  padding: ${({ theme }) => theme.espaco[14]};
  background: ${({ theme }) => theme.cores.destaque.base};
  color: ${({ theme }) => theme.cores.texto.sobreDestaque};

  ${noCelular} {
    justify-content: flex-end;
    min-height: ${({ theme }) => theme.altura.faixaDoLogin};
    padding: ${({ theme }) => theme.espaco[12]} ${({ theme }) => theme.espaco[11]};
  }
`

// O conteúdo fica na frente do desenho dos talhões.
export const Conteudo = styled.div`
  position: relative;
  display: contents;

  > * {
    position: relative;
  }
`
