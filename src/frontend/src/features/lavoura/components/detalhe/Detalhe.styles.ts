import styled, { css } from 'styled-components'
import type { NivelDoTema } from '../../../../shared/ui/nivel'
import type { NivelDoDia } from '../../tipos'

const cartao = css`
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartao};
`

export const Ciclo = styled.div`
  ${cartao}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[8]};
`

export const LinhaDoCiclo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco[4]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const Explicacao = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Barra = styled.div`
  height: ${({ theme }) => theme.altura.barraDoCiclo};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.fundo.trilho};
`

export const Preenchida = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.destaque.base};
`

export const Enso = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.enso.fundo};
  border-radius: ${({ theme }) => theme.raio.cartao};
  color: ${({ theme }) => theme.cores.enso.titulo};

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[2]};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
    color: ${({ theme }) => theme.cores.enso.texto};
  }
`

export const Secao = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.secao};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

export const Aviso = styled.div<{ $nivel: NivelDoTema }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.botao};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
`

export const TopoDoAviso = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[6]};

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

export const CorpoDoAviso = styled.span<{ $nivel: NivelDoTema }>`
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].corpo};
`

// Alinhado com o texto, depois do ícone.
export const PorQue = styled.button`
  align-self: flex-start;
  margin-left: ${({ theme }) => theme.espaco[13]};
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-decoration: underline;
  cursor: pointer;
`

export const Explicado = styled.p<{ $nivel: NivelDoTema }>`
  margin: 0 0 0 ${({ theme }) => theme.espaco[13]};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].corpo};
`

export const Abas = styled.div<{ $variante: 'abas' | 'filtros' }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco[2]};

  ${({ theme, $variante }) =>
    $variante === 'abas' &&
    css`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding: ${theme.espaco[2]};
      background: ${theme.cores.fundo.trilho};
      border-radius: ${theme.raio.botao};
    `}

  ${({ theme, $variante }) =>
    $variante === 'filtros' &&
    css`
      gap: ${theme.espaco[4]};
    `}
`

export const Aba = styled.button<{ $variante: 'abas' | 'filtros' }>`
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  cursor: pointer;

  ${({ theme, $variante }) =>
    $variante === 'abas' &&
    css`
      height: ${theme.altura.aba};
      padding: 0 ${theme.espaco[9]};
      border: none;
      border-radius: ${theme.raio.aba};
      background: transparent;
      color: ${theme.cores.texto.secundario};

      &[aria-pressed='true'] {
        background: ${theme.cores.fundo.cartao};
        color: ${theme.cores.texto.principal};
        box-shadow: ${theme.sombra.abaEscolhida};
      }
    `}

  ${({ theme, $variante }) =>
    $variante === 'filtros' &&
    css`
      height: ${theme.altura.filtro};
      padding: 0 ${theme.espaco[8]};
      font-size: ${theme.fonte.tamanho.apoio};
      border: ${theme.espessura.borda} solid ${theme.cores.borda.campo};
      border-radius: ${theme.raio.pilula};
      background: ${theme.cores.fundo.cartao};
      color: ${theme.cores.texto.principal};

      &[aria-pressed='true'] {
        background: ${theme.cores.texto.principal};
        border-color: ${theme.cores.texto.principal};
        color: ${theme.cores.texto.sobreDestaque};
      }
    `}
`

export const Atualizada = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

const corDaFrase = css<{ $nivel: NivelDoDia }>`
  color: ${({ theme, $nivel }) =>
    $nivel === 'ok' ? theme.cores.destaque.base : theme.cores.nivel[$nivel].texto};
`

export const ListaDeDias = styled.ul`
  ${cartao}
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;

  li + li {
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.borda.divisoria};
  }
`

export const DiaNaLista = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[7]};
`

export const QuandoNaLista = styled.span`
  width: ${({ theme }) => theme.largura.diaNaLista};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const ComoVaiSer = styled.span`
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};
`

export const FraseDoDia = styled.span<{ $nivel: NivelDoDia }>`
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  ${corDaFrase}
`

export const Chuva = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Temperaturas = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  white-space: nowrap;

  span {
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const GradeDeDias = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ theme }) => theme.largura.diaDaPrevisao}, 1fr)
  );
  gap: ${({ theme }) => theme.espaco[5]};
`

export const DiaNaGrade = styled.li<{ $nivel: NivelDoDia }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.botao};
  background: ${({ theme, $nivel }) =>
    $nivel === 'critico' ? theme.cores.diaCritico.fundo : theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid
    ${({ theme, $nivel }) =>
      $nivel === 'critico' ? theme.cores.diaCritico.borda : theme.cores.borda.cartao};

  > strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

export const IconeDoTempo = styled.span<{ $cor: 'sol' | 'nuvem' | 'chuva' }>`
  display: flex;
  color: ${({ theme, $cor }) => theme.cores.tempo[$cor]};
`

export const ListaDoHistorico = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
`

export const ItemDoHistorico = styled.li`
  ${cartao}
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};

  > span:last-child {
    margin-left: auto;
    color: ${({ theme }) => theme.cores.texto.secundario};
    white-space: nowrap;
  }
`

export const Selo = styled.span<{ $nivel: NivelDoTema }>`
  flex-shrink: 0;
  min-width: ${({ theme }) => theme.largura.seloDoHistorico};
  display: inline-block;
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[5]};
  border-radius: ${({ theme }) => theme.raio.selo};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  text-align: center;
  white-space: nowrap;
`

export const Tabela = styled.div`
  ${cartao}
  overflow-x: auto;

  table {
    width: 100%;
    min-width: ${({ theme }) => theme.largura.tabelaDoHistorico};
    border-collapse: collapse;
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  }

  th {
    text-align: left;
    color: ${({ theme }) => theme.cores.texto.secundario};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  th,
  td {
    padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[8]};
  }

  tbody tr {
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.borda.divisoria};
  }

  td:first-child {
    white-space: nowrap;
  }
`

export const Vazio = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[8]};
  text-align: center;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const LinkDiscreto = styled.button`
  align-self: center;
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0 ${({ theme }) => theme.espaco[5]};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
  color: ${({ theme }) => theme.cores.texto.secundario};
  text-decoration: underline;
  cursor: pointer;
`
