import styled from 'styled-components'
import { noComputador } from '../../styles/midia'
import { Botao } from './Botao.styles'
import { Entrada, Grupo, Rotulo } from './Campo.styles'
import type { NivelDoTema } from './nivel'

export const Veu = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${({ theme }) => theme.cores.fundo.veu};
  backdrop-filter: blur(${({ theme }) => theme.desfoque.veu});

  ${noComputador} {
    align-items: center;
    padding: ${({ theme }) => theme.espaco[11]};
  }
`

// Compacto, como a janela da conta: título, texto, campo e botões menores.
export const Dialogo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[7]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[10]}
    ${({ theme }) => theme.espaco[11]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.folha} ${({ theme }) => theme.raio.folha} 0 0;

  &:focus {
    outline: none;
  }

  ${noComputador} {
    max-width: ${({ theme }) => theme.largura.formulario};
    padding-top: ${({ theme }) => theme.espaco[10]};
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
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }

  form {
    margin-top: ${({ theme }) => theme.espaco[3]};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }

  ${Grupo} {
    gap: ${({ theme }) => theme.espaco[2]};
  }

  ${Rotulo} {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }

  ${Entrada} {
    height: ${({ theme }) => theme.altura.campoDeAcesso};
    padding: 0 ${({ theme }) => theme.espaco[7]};
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  }
`

export const Acoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};

  ${Botao} {
    min-height: ${({ theme }) => theme.altura.botaoDeAcesso};
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }
`
