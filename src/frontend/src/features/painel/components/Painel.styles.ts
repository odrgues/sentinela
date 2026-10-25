import styled, { keyframes } from 'styled-components'

export const Clima = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};
`

export const Temperatura = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.fonte.tamanho.temperatura};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
`

export const OndeEComo = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const IconeDoClima = styled.span<{ $quente: boolean }>`
  display: flex;
  color: ${({ theme, $quente }) =>
    $quente ? theme.cores.nivel.atencao.marcador : theme.cores.texto.icone};
`

export const Frase = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.frase};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
`

export const Atualizada = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const CabecalhoDaLista = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.secao};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.espaco[2]};
    padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[2]};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    text-decoration: none;
  }
`

export const Lista = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};
`

const pulsar = keyframes`
  50% { opacity: 0.5; }
`

export const Carregando = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};

  > p {
    margin: 0;
    align-self: center;
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const Bloco = styled.div<{ $largura?: string; $altura: string; $suave?: boolean }>`
  width: ${({ $largura }) => $largura ?? '100%'};
  height: ${({ $altura }) => $altura};
  border-radius: ${({ theme, $suave }) => ($suave ? theme.raio.cartao : theme.raio.barra)};
  background: ${({ theme, $suave }) =>
    $suave ? theme.cores.fundo.carregandoSuave : theme.cores.fundo.carregando};
  animation: ${pulsar} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
