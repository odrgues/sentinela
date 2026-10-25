import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/figtree/800.css'

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
