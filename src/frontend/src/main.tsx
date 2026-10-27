import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
// O estilo do Leaflet, dos mapas; os ajustes para o visual do app ficam em shared/mapa/Leaflet.styles.ts.
import 'leaflet/dist/leaflet.css'
// A Google Sans tem os pesos 400 a 700; onde o tema pede 800, o navegador usa o 700.
import '@fontsource/google-sans/400.css'
import '@fontsource/google-sans/500.css'
import '@fontsource/google-sans/600.css'
import '@fontsource/google-sans/700.css'
// A Noto Sans é a fonte de dentro dos cartões do painel (ver fonte.familiaDosCartoes).
import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans/500.css'
import '@fontsource/noto-sans/600.css'
import '@fontsource/noto-sans/700.css'

// Só em desenvolvimento: no build, o import.meta.env.DEV vira false e o MSW nem entra no pacote.
// Com `npm run dev:api`, fica desligada e tudo vai para o backend de verdade.
async function ligarApiDeMentira() {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_DE_MENTIRA === 'desligada') return
  const { worker } = await import('./mocks/navegador')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

// Se a API de mentira não ligar (por exemplo, aberto pelo IP da rede, sem service worker), o app abre mesmo assim.
ligarApiDeMentira()
  .catch(console.error)
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
