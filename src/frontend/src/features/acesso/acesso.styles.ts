import styled, { css } from 'styled-components'
import { noCelular } from '../../styles/midia'

export const Formulario = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};
`

export const Conteudo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
`

export const Cabecalho = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
`

export const Titulo = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.tituloDeAcesso};
  font-weight: ${({ theme }) => theme.fonte.peso.medio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};

  ${noCelular} {
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloComputador};
  }
`

export const Texto = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
  color: ${({ theme }) => theme.cores.texto.secundario};

  strong {
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`

// Uma explicação curta e pequena, logo embaixo do título.
export const Explicacao = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

// Os links das telas de acesso ficam sem sublinhado; ele aparece com o mouse em cima.
const semSublinhado = css`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const Rodape = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco[3]};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};

  a {
    ${semSublinhado}
    padding: ${({ theme }) => theme.espaco[2]};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`

export const LinkDaDireita = styled.span`
  align-self: flex-end;
  margin-top: -${({ theme }) => theme.espaco[4]};

  a {
    ${semSublinhado}
    display: block;
    padding: ${({ theme }) => theme.espaco[4]} 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    font-weight: ${({ theme }) => theme.fonte.peso.semiforte};

    ${noCelular} {
      font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    }
  }
`

// As dicas numeradas do "Confira seu e-mail", leves, sem caixa em volta.
export const Dicas = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};

  strong {
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`

export const Dica = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[4]};
`

export const NumeroDaDica = styled.span`
  flex-shrink: 0;
  width: ${({ theme }) => theme.espaco[10]};
  height: ${({ theme }) => theme.espaco[10]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.destaque.suave};
  color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`
