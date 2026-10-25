import styled from 'styled-components'

export const Grupo = styled.fieldset`
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
`

export const Legenda = styled.legend`
  padding: 0;
  margin-bottom: ${({ theme }) => theme.espaco[4]};
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

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

export const EntradaDaBusca = styled.input`
  width: 100%;
  height: ${({ theme }) => theme.altura.botaoSecundario};
  padding: 0 ${({ theme }) => theme.espaco[8]} 0 ${({ theme }) => theme.espaco[14]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.campo};
  color: ${({ theme }) => theme.cores.texto.principal};
  background: ${({ theme }) => theme.cores.fundo.campo};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.campo};
  border-radius: ${({ theme }) => theme.raio.campo};
`

export const Lista = styled.div<{ $comErro: boolean }>`
  display: flex;
  flex-direction: column;
  max-height: ${({ theme }) => theme.altura.listaDeCulturas};
  overflow-y: auto;
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme, $comErro }) =>
    $comErro
      ? `${theme.espessura.bordaDeErro} solid ${theme.cores.erro}`
      : `${theme.espessura.borda} solid ${theme.cores.borda.cartao}`};
  border-radius: ${({ theme }) => theme.raio.botao};
`

export const Opcao = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};
  min-height: ${({ theme }) => theme.altura.opcao};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[8]};
  cursor: pointer;

  & + & {
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.borda.divisoria};
  }

  &:has(input:checked) {
    background: ${({ theme }) => theme.cores.destaque.escolhido};
  }

  &:has(input:focus-visible) {
    outline: ${({ theme }) => theme.espessura.foco} solid ${({ theme }) => theme.cores.foco};
    outline-offset: -${({ theme }) => theme.espessura.foco};
  }
`

// A bolinha do rádio, desenhada: a de verdade fica escondida, mas é ela que o teclado usa.
export const Radio = styled.input`
  appearance: none;
  flex-shrink: 0;
  width: ${({ theme }) => theme.altura.bolinhaDaOpcao};
  height: ${({ theme }) => theme.altura.bolinhaDaOpcao};
  margin: 0;
  border: ${({ theme }) => theme.espessura.opcao} solid ${({ theme }) => theme.cores.borda.opcao};
  border-radius: ${({ theme }) => theme.raio.circulo};

  &:checked {
    border: ${({ theme }) => theme.espessura.opcaoEscolhida} solid
      ${({ theme }) => theme.cores.destaque.base};
  }

  &:focus-visible {
    outline: none;
  }
`

export const Textos = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};
`

export const Nome = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.campo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Ciclo = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Aviso = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[8]};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
