import styled, { css } from 'styled-components'
import { Botao } from '../../shared/ui/Botao.styles'
import { Entrada, Grupo, Rotulo } from '../../shared/ui/Campo.styles'
import { noCelular } from '../../styles/midia'

export const Formulario = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};

  /* Nas telas de acesso, o formulário é mais compacto que no resto do site, para o logo ter
     destaque: o rótulo mais perto da caixa de texto, e o rótulo, o campo e o botão menores. */
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

  ${Botao} {
    min-height: ${({ theme }) => theme.altura.botaoDeAcesso};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  }
`

export const Conteudo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[10]};
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

export const TextoCentral = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
  text-align: center;
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

export const IconeEmDestaque = styled.div<{ $tom: 'ok' | 'atencao' }>`
  width: ${({ theme }) => theme.altura.iconeEmDestaque};
  height: ${({ theme }) => theme.altura.iconeEmDestaque};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.quadro};
  background: ${({ theme, $tom }) => theme.cores.nivel[$tom].fundo};
  color: ${({ theme, $tom }) =>
    $tom === 'ok' ? theme.cores.destaque.base : theme.cores.nivel.atencao.texto};
`

export const Dicas = styled.ol`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[8]};
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartao};
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

export const Dica = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[5]};
`

export const NumeroDaDica = styled.span`
  flex-shrink: 0;
  width: ${({ theme }) => theme.espaco[11]};
  height: ${({ theme }) => theme.espaco[11]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.destaque.suave};
  color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`

export const LinkSimples = styled.span`
  align-self: center;

  a {
    ${semSublinhado}
    display: block;
    padding: ${({ theme }) => theme.espaco[6]};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`
