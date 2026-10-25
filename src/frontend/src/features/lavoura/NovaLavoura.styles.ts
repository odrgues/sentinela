import styled from 'styled-components'

// No computador: o mapa à esquerda e o formulário à direita.
export const Tela = styled.main`
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
`

export const ColunaDoFormulario = styled.div`
  flex: 1 1 ${({ theme }) => theme.largura.colunaDaLavoura};
  max-width: ${({ theme }) => theme.largura.formularioDaLavoura};
  padding: ${({ theme }) => theme.espaco[13]};
`

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
