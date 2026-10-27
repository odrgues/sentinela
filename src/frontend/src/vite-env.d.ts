/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  // 'desligada' no `npm run dev:api` (arquivo .env.api)
  readonly VITE_API_DE_MENTIRA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
