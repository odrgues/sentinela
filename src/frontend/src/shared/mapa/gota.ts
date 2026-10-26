// O desenho dos marcadores do mapa, no viewBox 0 0 56 72: uma gota com um furo redondo no meio,
// como o marcador do Google Maps. Use com fillRule="evenodd" para o furo ficar vazado.
const GOTA = 'M28 2 C 13 2 4 13 4 25 C 4 42 28 66 28 66 C 28 66 52 42 52 25 C 52 13 43 2 28 2 Z'
const FURO = 'M19 25 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 Z'

export const GOTA_VAZADA = `${GOTA} ${FURO}`
