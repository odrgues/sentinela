// A chave do Google Maps (VITE_GOOGLE_MAPS_KEY). Sem ela, os mapas mostram "Mapa desligado".
export function chaveDoGoogle() {
  return import.meta.env.VITE_GOOGLE_MAPS_KEY || null
}

// Os marcadores coloridos do painel pedem um Map ID. O DEMO_MAP_ID do Google serve para
// desenvolvimento; para produção, crie um Map ID no Google Cloud (VITE_GOOGLE_MAP_ID).
export function mapIdDoGoogle() {
  return import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID'
}
