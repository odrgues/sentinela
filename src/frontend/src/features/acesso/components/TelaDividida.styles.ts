import styled, { keyframes } from 'styled-components'
import { noCelular } from '../../../styles/midia'

// A entrada da página: o cartão aparece subindo de leve (2% da própria altura).
const entrar = keyframes`
  from {
    opacity: 0;
    transform: translateY(2%);
  }
`

export const Tela = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[11]};

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[11]} ${({ theme }) => theme.espaco[8]};
  }
`

// O formulário e a foto lado a lado, no meio da tela. No celular, a foto fica no alto do cartão.
export const Cartao = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.cartaoDeAcesso};
  min-height: ${({ theme }) => theme.altura.cartaoDeAcesso};
  display: flex;
  overflow: hidden;
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.linha} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.folha};
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
  animation: ${entrar} 700ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  ${noCelular} {
    min-height: 0;
    flex-direction: column;
  }
`

export const LadoDoFormulario = styled.main`
  flex: 1 1 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco[9]} ${({ theme }) => theme.espaco[13]};

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[11]};
  }
`

export const Coluna = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.formulario};
  display: flex;
  flex-direction: column;
`

// O logo, centralizado em cima do formulário.
export const LogoDoFormulario = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.espaco[8]};

  ${noCelular} {
    margin-bottom: ${({ theme }) => theme.espaco[11]};
  }
`

// No computador, a metade direita do cartão; no celular, a faixa fina no alto do cartão.
export const LadoDaFoto = styled.div`
  flex: 1 1 50%;
  display: flex;

  > * {
    flex-grow: 1;
  }

  ${noCelular} {
    order: -1;
    flex: 0 0 ${({ theme }) => theme.altura.faixaDaFoto};
  }
`
