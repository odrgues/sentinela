import styled from 'styled-components'
import { noComputador } from '../../styles/midia'
import type { NivelDoTema } from './nivel'

export const Veu = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${({ theme }) => theme.cores.fundo.veu};

  ${noComputador} {
    align-items: center;
    padding: ${({ theme }) => theme.espaco[11]};
  }
`

export const Dialogo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[12]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.folha} ${({ theme }) => theme.raio.folha} 0 0;

  &:focus {
    outline: none;
  }

  ${noComputador} {
    max-width: ${({ theme }) => theme.largura.cartaoCentral};
    padding-top: ${({ theme }) => theme.espaco[11]};
    border-radius: ${({ theme }) => theme.raio.folha};
  }
`

export const Alca = styled.div`
  align-self: center;
  width: ${({ theme }) => theme.largura.alcaDaFolha};
  height: ${({ theme }) => theme.altura.alcaDaFolha};
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.borda.campo};

  ${noComputador} {
    display: none;
  }
`

export const Icone = styled.div<{ $nivel: NivelDoTema }>`
  width: ${({ theme }) => theme.altura.iconeDaConfirmacao};
  height: ${({ theme }) => theme.altura.iconeDaConfirmacao};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => ($nivel === 'ok' ? theme.cores.destaque.base : theme.cores.erro)};
`

export const Textos = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDaConfirmacao};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }

  form {
    margin-top: ${({ theme }) => theme.espaco[4]};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const Acoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
`
