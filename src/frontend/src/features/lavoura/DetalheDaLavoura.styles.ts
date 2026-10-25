import { Link } from 'react-router'
import styled from 'styled-components'
import { noCelular } from '../../styles/midia'

export const PaginaDoCelular = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[9]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[10]}
    ${({ theme }) => theme.espaco[11]};
`

export const PaginaDoComputador = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.detalhe};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[11]};
  padding: ${({ theme }) => theme.espaco[11]} ${({ theme }) => theme.espaco[13]}
    ${({ theme }) => theme.espaco[14]};
`

export const VoltarAoPainel = styled(Link)`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[3]} 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-decoration: none;
`

export const Cabecalho = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[8]};
`

export const Nome = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[2]};

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloComputador};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const NomeGrande = styled(Nome)`
  h1 {
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDoDetalhe};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  }
`

export const Acoes = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.espaco[5]};
`

export const Colunas = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[11]};
`

export const ColunaDaEsquerda = styled.div`
  flex: 1 1 ${({ theme }) => theme.largura.colunaDoDetalhe};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
`

export const ColunaDaDireita = styled.div`
  flex: 2 1 ${({ theme }) => theme.largura.colunaDaPrevisao};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
`

export const LinhaDasAbas = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};

  ${noCelular} {
    > * {
      flex-grow: 1;
    }
  }
`

export const Encerrada = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.campo};
  background: ${({ theme }) => theme.cores.fundo.semPrevisao};
  color: ${({ theme }) => theme.cores.texto.semPrevisao};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
`
