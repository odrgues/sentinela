import styled from 'styled-components'
import { noComputador } from '../../styles/midia'

// O local com um rótulo, como os outros campos, para alinhar com a coluna do lado.
export const GrupoDoLocal = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[2]};
`

export const RotuloDoLocal = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

// Enquanto carrega, ou quando a lavoura não existe: um cartão simples no meio da página.
export const Pagina = styled.main`
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[11]};

  ${noComputador} {
    width: 100%;
    max-width: ${({ theme }) => theme.largura.cartaoCentral};
    margin: ${({ theme }) => theme.espaco[13]} auto;
  }
`

export const Recalcula = styled.p`
  margin: 0;
  display: flex;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[6]};
  background: ${({ theme }) => theme.cores.enso.fundo};
  border-radius: ${({ theme }) => theme.raio.campo};
  color: ${({ theme }) => theme.cores.enso.titulo};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};

  svg {
    flex-shrink: 0;
  }
`

export const Excluir = styled.button`
  min-height: ${({ theme }) => theme.altura.botaoSecundario};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.erro};
  cursor: pointer;
`

export const Aviso = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
