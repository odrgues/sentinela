import styled from 'styled-components'
import { noCelular, noComputador } from '../../styles/midia'

export const Formulario = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[9]};
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
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
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

export const TextoCentral = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
  text-align: center;
`

// No celular, empurra o rodapé para o fim da tela.
export const Espaco = styled.div`
  flex-grow: 1;

  ${noComputador} {
    display: none;
  }
`

export const Rodape = styled.p`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco[3]};
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  color: ${({ theme }) => theme.cores.texto.secundario};

  a {
    padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[2]};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`

export const LinkDaDireita = styled.span`
  align-self: flex-end;
  margin-top: -${({ theme }) => theme.espaco[4]};

  a {
    display: block;
    padding: ${({ theme }) => theme.espaco[4]} 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
    font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
  }
`

export const TopoDoCelular = styled.div`
  padding: 0 ${({ theme }) => theme.espaco[8]};
`

// A frase embaixo da marca, na faixa verde do celular.
export const Lema = styled.p`
  margin: ${({ theme }) => theme.espaco[5]} 0 0;
  max-width: ${({ theme }) => theme.largura.textoDaFaixa};
  font-size: ${({ theme }) => theme.fonte.tamanho.secao};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.sobreMarca};
`

export const CartaoDaFaixa = styled.div`
  max-width: ${({ theme }) => theme.largura.textoDaFaixa};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[10]};
  padding: ${({ theme }) => theme.espaco[12]};
  background: ${({ theme }) => theme.cores.marca.cartao};
  border-radius: ${({ theme }) => theme.raio.quadro};
`

export const ChamadaDaFaixa = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.marca};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`

export const ListaDaFaixa = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[7]};
  font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.sobreMarca};
`

export const ItemDaFaixa = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[6]};

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.cores.marca.sol};
  }
`

export const NumeroDoPasso = styled.span`
  flex-shrink: 0;
  width: ${({ theme }) => theme.altura.numeroDoPasso};
  height: ${({ theme }) => theme.altura.numeroDoPasso};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.marca.sol};
  color: ${({ theme }) => theme.cores.texto.principal};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
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
    display: block;
    padding: ${({ theme }) => theme.espaco[6]};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`
