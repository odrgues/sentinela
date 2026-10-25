import styled from 'styled-components'

export const Linha = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[7]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.botao};
`

export const Textos = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const Trilho = styled.button`
  position: relative;
  flex-shrink: 0;
  width: ${({ theme }) => theme.largura.chave};
  height: ${({ theme }) => theme.altura.chave};
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.borda.opcao};
  cursor: pointer;

  &[aria-checked='true'] {
    background: ${({ theme }) => theme.cores.destaque.base};
  }

  &::after {
    content: '';
    position: absolute;
    top: ${({ theme }) => theme.espaco[2]};
    left: ${({ theme }) => theme.espaco[2]};
    width: ${({ theme }) => theme.altura.bolinhaDaChave};
    height: ${({ theme }) => theme.altura.bolinhaDaChave};
    border-radius: ${({ theme }) => theme.raio.circulo};
    background: ${({ theme }) => theme.cores.fundo.cartao};
    box-shadow: ${({ theme }) => theme.sombra.bolinhaDaChave};
    transition: transform 0.15s ease;
  }

  &[aria-checked='true']::after {
    transform: translateX(
      calc(${({ theme }) => theme.largura.chave} - ${({ theme }) => theme.altura.chave})
    );
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`
