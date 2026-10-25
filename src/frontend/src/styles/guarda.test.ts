import { describe, expect, it } from 'vitest'

const arquivos = import.meta.glob<string>(
  ['/src/**/*.{ts,tsx,css}', '!/src/styles/**', '!/src/**/*.test.{ts,tsx}'],
  { query: '?raw', import: 'default', eager: true },
)

const COR_HEX = /#[0-9a-fA-F]{3,8}\b/
const COR_FUNCAO = /\b(rgb|rgba|hsl|hsla)\(/
const COR_NOME =
  /(:\s*|['"`])(white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|navy|teal|maroon|olive|lime|aqua|cyan|magenta|fuchsia|brown|gold|beige|crimson|indigo|violet|tomato|coral|salmon|khaki|tan)\b/i
const TAMANHO = /\b\d+(\.\d+)?(px|rem|em|cqi)\b/
const TAMANHO_DE_ICONE = /\b(size|strokeWidth)=\{\s*\d/
const TAMANHO_INTERPOLADO = /\}(px|rem|em)\b/

const VALORES_DIGITADOS = [
  COR_HEX,
  COR_FUNCAO,
  COR_NOME,
  TAMANHO,
  TAMANHO_INTERPOLADO,
  TAMANHO_DE_ICONE,
]

function ehComentario(linha: string) {
  const texto = linha.trim()
  return texto.startsWith('//') || texto.startsWith('/*') || texto.startsWith('*')
}

function temValorDigitado(linha: string) {
  return !ehComentario(linha) && VALORES_DIGITADOS.some((valor) => valor.test(linha))
}

describe('guarda do tema', () => {
  it('nenhum arquivo fora de styles/ digita cor ou tamanho', () => {
    const problemas = Object.entries(arquivos).flatMap(([caminho, texto]) =>
      texto
        .split('\n')
        .map((linha, i) => ({ linha, numero: i + 1 }))
        .filter(({ linha }) => temValorDigitado(linha))
        .map(({ linha, numero }) => `${caminho}:${numero}  ${linha.trim()}`),
    )

    expect(problemas).toEqual([])
  })

  it('linha de comentário não conta, mesmo com # e número', () => {
    expect(temValorDigitado('// ver issue #123')).toBe(false)
    expect(temValorDigitado('  * o fundo era #fff no canvas')).toBe(false)
    expect(temValorDigitado("const fundo = '#fff'")).toBe(true)
  })

  it('pega o tamanho de ícone digitado e o cqi, e deixa passar o que vem do tema', () => {
    expect(temValorDigitado('<Menu size={20} aria-hidden />')).toBe(true)
    expect(temValorDigitado('<Check size={icone.selo} strokeWidth={2.75} />')).toBe(true)
    expect(temValorDigitado('font-size: min(${tamanho}, 11cqi);')).toBe(true)
    expect(temValorDigitado('<Menu size={icone.topo} aria-hidden />')).toBe(false)
  })
})
