import styled from 'styled-components'
import { noCelular, noComputador } from '../../styles/midia'

export const Pagina = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[9]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[11]};

  ${noCelular} {
    min-height: 100dvh;
  }

  ${noComputador} {
    width: 100%;
    max-width: ${({ theme }) => theme.largura.conta};
    margin: 0 auto;
    padding: ${({ theme }) => theme.espaco[13]} ${({ theme }) => theme.espaco[11]}
      ${({ theme }) => theme.espaco[14]};
  }
`

export const Titulo = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.tituloComputador};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};

  ${noComputador} {
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDeAcesso};
  }
`

export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[9]};

  ${noComputador} {
    padding: ${({ theme }) => theme.espaco[12]};
    background: ${({ theme }) => theme.cores.fundo.cartao};
    border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
    border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  }
`

export const LinhaDosBotoes = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};

  ${noComputador} {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: ${({ theme }) => theme.espaco[6]};

    > button[type='submit'] {
      padding: 0 ${({ theme }) => theme.espaco[12]};
    }
  }
`

export const LinkDeTexto = styled.button`
  align-self: center;
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0 ${({ theme }) => theme.espaco[4]};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.destaque.base};
  text-decoration: underline;
  cursor: pointer;
`

export const Enviado = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.campo};
  background: ${({ theme }) => theme.cores.destaque.suave};
  color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

// No celular, empurra Sair e Excluir para o fim da tela.
export const Espaco = styled.div`
  flex-grow: 1;

  ${noComputador} {
    display: none;
  }
`

export const Faixa = styled.div<{ $perigo?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[10]} ${({ theme }) => theme.espaco[12]};
  background: ${({ theme, $perigo }) =>
    $perigo ? theme.cores.diaCritico.fundo : theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid
    ${({ theme, $perigo }) => ($perigo ? theme.cores.diaCritico.borda : theme.cores.borda.cartao)};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
`

export const TextoDaFaixa = styled.div<{ $perigo?: boolean }>`
  max-width: ${({ theme }) => theme.largura.textoDoPerigo};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
    color: ${({ theme, $perigo }) =>
      $perigo ? theme.cores.nivel.critico.texto : theme.cores.texto.principal};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
    color: ${({ theme, $perigo }) =>
      $perigo ? theme.cores.nivel.critico.corpo : theme.cores.texto.secundario};
  }
`

export const Excluir = styled.button`
  min-height: ${({ theme }) => theme.altura.toque};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.erro};
  cursor: pointer;
`

export const Aviso = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
