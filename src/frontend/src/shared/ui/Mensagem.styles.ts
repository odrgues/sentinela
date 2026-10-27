import styled, { keyframes } from 'styled-components'

// Desce de leve e aparece, para chamar a atenção sem assustar.
const descer = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -120%);
  }
`

export const Mensagem = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.espaco[8]};
  left: 50%;
  transform: translateX(-50%);
  /* Acima da janela da Minha conta (15). */
  z-index: 20;
  width: calc(100% - 2 * ${({ theme }) => theme.espaco[8]});
  max-width: ${({ theme }) => theme.largura.formulario};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.fundo.mensagem};
  color: ${({ theme }) => theme.cores.texto.sobreDestaque};
  border-radius: ${({ theme }) => theme.raio.botao};
  box-shadow: ${({ theme }) => theme.sombra.mensagem};
  font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  animation: ${descer} 350ms cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.cores.sucesso};
  }
`
