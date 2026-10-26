import styled from 'styled-components'

export const Tela = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[14]} ${({ theme }) => theme.espaco[8]};
  text-align: center;

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDeAcesso};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  p {
    margin: 0;
    max-width: ${({ theme }) => theme.largura.formulario};
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

// O botão do tamanho do texto e centralizado.
export const Acoes = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.espaco[5]};
  margin-top: ${({ theme }) => theme.espaco[4]};

  > * {
    padding: 0 ${({ theme }) => theme.espaco[10]};
  }
`

// A página não encontrada fica fora da Casca: ocupa a tela toda sozinha.
export const TelaInteira = styled(Tela)`
  min-height: 100dvh;
`
