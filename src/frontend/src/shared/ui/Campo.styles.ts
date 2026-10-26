import styled from 'styled-components'

export const Grupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[2]};
`

export const Rotulo = styled.label`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Opcional = styled.span`
  font-weight: ${({ theme }) => theme.fonte.peso.medio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

// O campo e, na senha, o botão de mostrar por cima dele, no canto direito.
export const CaixaDaEntrada = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

export const Entrada = styled.input<{ $comErro: boolean; $comBotao?: boolean }>`
  height: ${({ theme }) => theme.altura.campo};
  padding: 0 ${({ theme }) => theme.espaco[7]};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.campo};
  color: ${({ theme }) => theme.cores.texto.principal};
  background: ${({ theme }) => theme.cores.fundo.campo};
  border: ${({ theme, $comErro }) =>
    $comErro
      ? `${theme.espessura.bordaDeErro} solid ${theme.cores.erro}`
      : `${theme.espessura.borda} solid ${theme.cores.borda.campo}`};
  border-radius: ${({ theme }) => theme.raio.campo};

  /* Espaço para o botão de mostrar a senha não cobrir o texto. */
  ${({ theme, $comBotao }) =>
    $comBotao &&
    `
      padding-right: ${theme.altura.botaoRedondo};
    `}

  &:read-only {
    color: ${({ theme }) => theme.cores.texto.secundario};
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
    border-color: ${({ theme }) => theme.cores.borda.cartao};
  }
`

export const Erro = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
  color: ${({ theme }) => theme.cores.erro};
`

export const Dica = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const BotaoDaSenha = styled.button`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.espaco[3]};
  transform: translateY(-50%);
  width: ${({ theme }) => theme.altura.avatar};
  height: ${({ theme }) => theme.altura.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: none;
  color: ${({ theme }) => theme.cores.texto.secundario};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`
