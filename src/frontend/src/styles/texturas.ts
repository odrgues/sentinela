import { cores } from './cores'

function svg(desenho: string, largura: number, altura: number) {
  const arquivo = `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}" fill="none">${desenho}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(arquivo)}")`
}

// Linhas que sobem e descem juntas, como as curvas de nível de um mapa ou as fileiras de uma
// lavoura vista de cima. Fica por trás do cartão do ciclo.
export function curvasDeNivel(cor: string) {
  const linha = 'M-20 120 C 70 60, 140 170, 230 110 S 360 40, 440 90'
  const linhas = Array.from(
    { length: 9 },
    (_, i) => `<path d="${linha}" transform="translate(0 ${i * 26})"/>`,
  ).join('')
  return svg(`<g stroke="${cor}" stroke-width="1.5">${linhas}</g>`, 420, 300)
}

// Uma ondinha que se repete na horizontal: o mar do El Niño.
export function ondas(cor: string) {
  const onda = 'M0 10 Q 14 0 28 10 T 56 10'
  const linhas = [0, 12].map((y) => `<path d="${onda}" transform="translate(0 ${y})"/>`).join('')
  return svg(`<g stroke="${cor}" stroke-width="1.6" stroke-linecap="round">${linhas}</g>`, 56, 24)
}

export const texturas = {
  curvasDoCiclo: curvasDeNivel(cores.ciclo.textura),
  ondasDoEnso: ondas(cores.enso.onda),
  // O tamanho do desenho das ondas, para a textura repetir sem esticar.
  tamanhoDasOndas: '56px 24px',
  tamanhoDasCurvas: '420px 300px',
}
