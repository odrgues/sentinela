/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_GOOGLE_MAPS_KEY?: string
  readonly VITE_GOOGLE_MAP_ID?: string
  // 'desligada' no `npm run dev:api` (arquivo .env.api)
  readonly VITE_API_DE_MENTIRA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
