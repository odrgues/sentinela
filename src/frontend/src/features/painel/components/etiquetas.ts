// Com muitas lavouras juntas no mapa, os nomes ficam uns por cima dos outros e ninguém lê. Aqui se
// decide quais nomes aparecem: as lavouras mais urgentes primeiro, e só se o nome não cobrir outro
// nome nem outro marcador. Os que ficam de fora aparecem ao passar o mouse no marcador.

// O quanto cada letra do nome ocupa e o que a etiqueta tem além das letras, em pixels da tela.
const LARGURA_POR_LETRA = 8
const FOLGA_DA_ETIQUETA = 24
const ALTURA_DA_ETIQUETA = 34

export type PontoNaTela = {
  id: number
  // Onde fica a ponta do marcador, em pixels, a partir do canto do mapa.
  x: number
  y: number
  // Menor é mais urgente: 0 crítico, 1 atenção, 2 tudo certo.
  prioridade: number
  apelido: string
}

type Caixa = { esquerda: number; direita: number; cima: number; baixo: number }

function seCruzam(a: Caixa, b: Caixa) {
  return a.esquerda < b.direita && a.direita > b.esquerda && a.cima < b.baixo && a.baixo > b.cima
}

function caixaDoMarcador({ x, y }: PontoNaTela, pino: { largura: number; altura: number }): Caixa {
  return {
    esquerda: x - pino.largura / 2,
    direita: x + pino.largura / 2,
    cima: y - pino.altura,
    baixo: y,
  }
}

// A etiqueta fica em cima do marcador, centralizada nele.
function caixaDaEtiqueta(ponto: PontoNaTela, pino: { largura: number; altura: number }): Caixa {
  const largura = ponto.apelido.length * LARGURA_POR_LETRA + FOLGA_DA_ETIQUETA
  const baixo = ponto.y - pino.altura
  return {
    esquerda: ponto.x - largura / 2,
    direita: ponto.x + largura / 2,
    cima: baixo - ALTURA_DA_ETIQUETA,
    baixo,
  }
}

// Os ids das lavouras que mostram o nome.
export function etiquetasVisiveis(
  pontos: PontoNaTela[],
  pino: { largura: number; altura: number },
) {
  const marcadores = pontos.map((ponto) => ({ id: ponto.id, caixa: caixaDoMarcador(ponto, pino) }))
  const colocadas: Caixa[] = []
  const visiveis = new Set<number>()

  const porUrgencia = [...pontos].sort((a, b) => a.prioridade - b.prioridade || a.id - b.id)
  for (const ponto of porUrgencia) {
    const caixa = caixaDaEtiqueta(ponto, pino)
    const cobreMarcador = marcadores.some(
      (outro) => outro.id !== ponto.id && seCruzam(caixa, outro.caixa),
    )
    if (cobreMarcador || colocadas.some((outra) => seCruzam(caixa, outra))) continue
    colocadas.push(caixa)
    visiveis.add(ponto.id)
  }
  return visiveis
}
