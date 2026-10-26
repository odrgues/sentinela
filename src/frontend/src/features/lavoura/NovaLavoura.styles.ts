import styled from 'styled-components'
import * as TelaComMapa from '../../shared/layout/TelaComMapa.styles'
import { Botao } from '../../shared/ui/Botao.styles'
import { Entrada } from '../../shared/ui/Campo.styles'
import * as Cultura from './components/EscolherCultura.styles'
import * as Local from './components/LocalMarcado.styles'
import * as Mapa from './components/mapa/Mapa.styles'

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
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
  font-size: ${({ theme }) => theme.fonte.tamanho.secao};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

export const TituloNoMapa = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.secao};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
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

// No computador, o formulário num cartão em cima do vidro (TelaComMapa.styles.ts).
export const CartaoDoFormulario = styled(TelaComMapa.Cartao)`
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};

  ${TituloDaTela} {
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDaTela};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  ${Subtitulo} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }
`

// No celular: o mapa no alto (com a busca e o "Usar minha localização" por cima) e o
// formulário numa folha que sobe um pouco por cima dele, como no painel.
export const MapaDoCelular = styled.div`
  ${Mapa.Area} {
    height: ${({ theme }) => theme.altura.mapaNoCelular};
  }
`

export const FolhaDoCelular = styled.main`
  position: relative;
  z-index: 1;
  margin-top: -${({ theme }) => theme.espaco[11]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]}
    ${({ theme }) => theme.espaco[11]};

  background: ${({ theme }) => theme.cores.fundo.pagina};
  border-radius: ${({ theme }) => theme.raio.folha} ${({ theme }) => theme.raio.folha} 0 0;
  box-shadow: ${({ theme }) => theme.sombra.folha};

  /* Compacta, nas proporções da folha do painel: campos, lista de culturas e botões menores. */
  ${Formulario} {
    gap: ${({ theme }) => theme.espaco[6]};
  }

  ${TituloDaTela} {
    font-size: ${({ theme }) => theme.fonte.tamanho.secao};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  ${Entrada}, ${Cultura.EntradaDaBusca} {
    height: ${({ theme }) => theme.altura.botaoSecundario};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${Cultura.Lista} {
    max-height: ${({ theme }) => theme.altura.listaDeCulturasPequena};
  }

  ${Cultura.Opcao} {
    min-height: ${({ theme }) => theme.altura.botaoSecundario};
    padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[6]};
  }

  ${Cultura.Nome} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${Cultura.Radio} {
    width: ${({ theme }) => theme.espaco[9]};
    height: ${({ theme }) => theme.espaco[9]};
  }

  ${Local.Cartao} {
    padding: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[6]};
  }

  ${Local.Cidade} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${Botao} {
    min-height: ${({ theme }) => theme.altura.botaoSecundario};
  }

  ${Subtitulo} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }
`
