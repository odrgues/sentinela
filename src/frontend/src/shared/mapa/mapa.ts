// Os mapas são do Leaflet, com imagens grátis que não pedem chave nem conta.

// Nos testes (jsdom) não tem como desenhar o mapa: as telas mostram "Mapa desligado".
export function mapaLigado() {
  return import.meta.env.MODE !== 'test'
}

export const CENTRO_DO_BRASIL: [number, number] = [-14.235, -51.9253]
export const ZOOM_DO_BRASIL = 4

// Painel e marcar a lavoura: foto de satélite da Esri, com os nomes das cidades por cima. Em parte da zona
// rural, a foto só existe até o zoom 17; mais perto que isso, o Leaflet amplia a do 17.
export const SATELITE = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  nomes:
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  creditos: 'Imagens &copy; Esri',
  zoomDaFoto: 17,
  zoomMaximo: 19,
}

// Metade da largura do mundo na projeção dos mapas da web (Web Mercator), em metros.
const MEIO_MUNDO = 20037508.34

// Uma foto de satélite pronta, com o ponto bem no meio, do serviço de exportação da mesma Esri
// (uma imagem só, sem montar o mapa). metrosPorPixel: 1,2 é perto do zoom 17.
export function fotoDeSatelite(
  latitude: number,
  longitude: number,
  largura: number,
  altura: number,
  metrosPorPixel: number,
) {
  const x = (longitude * MEIO_MUNDO) / 180
  const y = (Math.log(Math.tan(((90 + latitude) * Math.PI) / 360)) / Math.PI) * MEIO_MUNDO
  const meiaLargura = (largura * metrosPorPixel) / 2
  const meiaAltura = (altura * metrosPorPixel) / 2
  const caixa = [x - meiaLargura, y - meiaAltura, x + meiaLargura, y + meiaAltura]
    .map((metros) => Math.round(metros))
    .join(',')
  return (
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export' +
    `?bbox=${caixa}&bboxSR=3857&imageSR=3857&size=${largura},${altura}&format=jpg&f=image`
  )
}
