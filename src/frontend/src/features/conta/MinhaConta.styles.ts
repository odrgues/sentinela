import styled, { css, keyframes } from 'styled-components'
import { Botao } from '../../shared/ui/Botao.styles'
import { Dica, Entrada, Grupo, Rotulo } from '../../shared/ui/Campo.styles'
import * as Chave from '../../shared/ui/Chave.styles'
import folhas from '../../assets/folhas.jpg'
import { noCelular, noComputador } from '../../styles/midia'

// Quanto dura a saída da janela, em milissegundos. O MinhaConta.tsx espera esse tempo para
// trocar de página depois de fechar.
export const DURACAO_DA_SAIDA = 200

const clarear = keyframes`
  from {
    opacity: 0;
  }
`

const escurecer = keyframes`
  to {
    opacity: 0;
  }
`

// No computador, a janela aparece no meio da tela, crescendo de leve.
const chegarNoMeio = keyframes`
  from {
    opacity: 0;
    transform: translateY(2%) scale(0.97);
  }
`

const sairDoMeio = keyframes`
  to {
    opacity: 0;
    transform: translateY(2%) scale(0.97);
  }
`

// No celular, a janela sobe de baixo e desce ao fechar.
const subir = keyframes`
  from {
    transform: translateY(100%);
  }
`

const descer = keyframes`
  to {
    transform: translateY(100%);
  }
`

const entrada = 'cubic-bezier(0.22, 1, 0.36, 1)'

// O fundo escuro em volta da janela: tocar nele fecha. O escuro fica numa camada própria
// (::before) para aparecer aos poucos sem deixar a janela transparente junto.
export const Veu = styled.div<{ $fechando: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco[8]};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.cores.fundo.veu};
    backdrop-filter: blur(${({ theme }) => theme.desfoque.veu});
    pointer-events: none;
    animation: ${({ $fechando }) =>
      $fechando
        ? css`
            ${escurecer} ${DURACAO_DA_SAIDA}ms ease-in both
          `
        : css`
            ${clarear} 260ms ease-out both
          `};
  }

  ${noCelular} {
    align-items: flex-end;
    padding: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    > * {
      animation: none !important;
    }
  }
`

export const Janela = styled.div<{ $fechando: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${({ theme }) => theme.largura.cartaoCentral};
  max-height: 100%;
  overflow-y: auto;
  /* Numa tela muito baixa, a janela rola, mas sem mostrar a barra. */
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.cores.fundo.cartao};

  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: ${({ theme }) => theme.raio.folha};
  box-shadow: ${({ theme }) => theme.sombra.mensagem};

  &:focus {
    outline: none;
  }

  ${noComputador} {
    animation: ${({ $fechando }) =>
      $fechando
        ? css`
            ${sairDoMeio} ${DURACAO_DA_SAIDA}ms ease-in both
          `
        : css`
            ${chegarNoMeio} 320ms ${entrada} both
          `};
  }

  ${noCelular} {
    max-width: none;
    max-height: 92dvh;
    border-radius: ${({ theme }) => theme.raio.folha} ${({ theme }) => theme.raio.folha} 0 0;
    animation: ${({ $fechando }) =>
      $fechando
        ? css`
            ${descer} ${DURACAO_DA_SAIDA}ms ease-in both
          `
        : css`
            ${subir} 360ms ${entrada} both
          `};
  }
`

// A foto das folhas (a mesma das telas de acesso) numa faixa no alto da janela, de ponta a ponta. A cor de fundo aparece
// enquanto a foto carrega.
export const Faixa = styled.div`
  position: relative;
  flex-shrink: 0;
  height: ${({ theme }) => theme.altura.faixaDaConta};
  background: ${({ theme }) => theme.cores.fundo.carregando} url(${folhas}) center 45% / cover
    no-repeat;
`

// A alça no alto da folha, no celular, por cima da foto.
export const Alca = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.espaco[4]};
  left: 50%;
  transform: translateX(-50%);
  width: ${({ theme }) => theme.largura.alcaDaFolha};
  height: ${({ theme }) => theme.altura.alcaDaFolha};
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.texto.sobreDestaque};

  ${noComputador} {
    display: none;
  }
`

// Tudo o que vem embaixo da foto.
export const Corpo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[9]};

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[10]}
      ${({ theme }) => theme.espaco[11]};
  }
`

// O X fica por cima da foto, no canto de cima.
export const Fechar = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.espaco[6]};
  right: ${({ theme }) => theme.espaco[6]};
  width: ${({ theme }) => theme.altura.avatar};
  height: ${({ theme }) => theme.altura.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  box-shadow: ${({ theme }) => theme.sombra.etiqueta};
  color: ${({ theme }) => theme.cores.texto.principal};
  cursor: pointer;
  transition: background 200ms ease;

  &:hover {
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
  }
`

// O formulário compacto, como nas telas de acesso: rótulo, campo e botão menores.
export const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};

  ${Grupo} {
    gap: ${({ theme }) => theme.espaco[2]};
  }

  ${Rotulo} {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }

  ${Entrada} {
    height: ${({ theme }) => theme.altura.campoDeAcesso};
    padding: 0 ${({ theme }) => theme.espaco[7]};
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  }

  ${Dica} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  /* "Receber avisos automáticos": o quadro e a explicação menores, no computador e no celular. */
  ${Chave.Linha} {
    padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[7]};
  }

  ${Chave.Textos} span {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${Botao} {
    min-height: ${({ theme }) => theme.altura.filtro};
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }
`

export const LinhaDosBotoes = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};

  > button[type='submit'] {
    flex-shrink: 0;
    padding: 0 ${({ theme }) => theme.espaco[12]};
  }
`

export const LinkDeTexto = styled.button`
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0 ${({ theme }) => theme.espaco[2]};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.destaque.base};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

// "Mandamos um link…": no lugar do "Trocar minha senha", na mesma linha do Salvar.
export const Enviado = styled.p`
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

// Sair e excluir, separados do formulário por uma linha.
export const Rodape = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};
  padding-top: ${({ theme }) => theme.espaco[5]};
  border-top: ${({ theme }) => theme.espessura.linha} solid
    ${({ theme }) => theme.cores.borda.cartao};

  ${Botao} {
    min-height: ${({ theme }) => theme.altura.filtro};
    padding: 0 ${({ theme }) => theme.espaco[8]};
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }
`

export const Excluir = styled.button`
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0 ${({ theme }) => theme.espaco[2]};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.erro};
  cursor: pointer;
`

export const Aviso = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
