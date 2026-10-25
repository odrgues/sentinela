import styled from 'styled-components'

export const Busca = styled.div`
  position: relative;

  > svg {
    position: absolute;
    left: ${({ theme }) => theme.espaco[7]};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.cores.texto.secundario};
    pointer-events: none;
  }
`

export const Entrada = styled.input`
  width: 100%;
  height: ${({ theme }) => theme.altura.campo};
  padding: 0 ${({ theme }) => theme.espaco[8]} 0 ${({ theme }) => theme.espaco[14]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.campo};
  color: ${({ theme }) => theme.cores.texto.principal};
  background: ${({ theme }) => theme.cores.fundo.pagina};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.campo};
  border-radius: ${({ theme }) => theme.raio.campo};
`

export const Sugestoes = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: ${({ theme }) => theme.altura.listaDeCulturas};
  overflow-y: auto;
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.campo};

  li + li {
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.borda.divisoria};
  }
`

export const Sugestao = styled.button`
  width: 100%;
  min-height: ${({ theme }) => theme.altura.toque};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[7]};
  border: none;
  background: ${({ theme }) => theme.cores.fundo.cartao};
  text-align: left;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  color: ${({ theme }) => theme.cores.texto.principal};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.cores.destaque.escolhido};
  }
`
