import styled from 'styled-components'
import * as TelaComMapa from '../../shared/layout/TelaComMapa.styles'
import { Botao } from '../../shared/ui/Botao.styles'
import { Dica, Entrada, Grupo, Rotulo } from '../../shared/ui/Campo.styles'

export const PaginaDoCelular = styled.main`
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[11]};
`

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[9]};
`

export const Cabecalho = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[3]};
`

export const LinhaDoPasso = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[2]};
`

export const Passo = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Titulo = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.tituloComputador};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

export const TituloNoMapa = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.tituloNoMapa};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

export const TituloDaTela = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.tituloDaTela};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

export const Subtitulo = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

// No computador, o formulário num cartão em cima do vidro (TelaComMapa.styles.ts), compacto
// como a janela da conta: título, rótulos, campos e botão menores.
export const CartaoDoFormulario = styled(TelaComMapa.Cartao)`
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[9]};

  ${Formulario} {
    gap: ${({ theme }) => theme.espaco[7]};
  }

  ${TituloDaTela} {
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDeAcesso};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  ${Subtitulo} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
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

  ${Dica} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${Botao} {
    min-height: ${({ theme }) => theme.altura.botaoDeAcesso};
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }
`
