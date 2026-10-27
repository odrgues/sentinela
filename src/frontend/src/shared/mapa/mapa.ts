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
