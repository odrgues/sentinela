import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

// O worker do MSW mora em public/ para o modo dev, e o Vite copia public/ inteira no build.
function semApiDeMentiraNoBuild(): Plugin {
  let pastaDoBuild = 'dist'
  return {
    name: 'sem-api-de-mentira-no-build',
    apply: 'build',
    configResolved(config) {
      pastaDoBuild = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      await rm(resolve(pastaDoBuild, 'mockServiceWorker.js'), { force: true })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), semApiDeMentiraNoBuild()],
  server: {
    // O que a API de mentira não responde vai para o backend de verdade, rodando na 8080.
    proxy: { '/api': 'http://localhost:8080' },
  },
  test: {
    environment: 'jsdom',
    // As telas inteiras (preencher o formulário, salvar e voltar ao painel) passam dos 5 s
    // padrão em máquina carregada; o limite maior evita falha por lentidão, não por erro.
    testTimeout: 15_000,
    setupFiles: './src/test/setup.ts',
    // sem isso o Vitest entrega o CSS vazio, e a guarda do tema não enxergaria os .css de src/
    css: { include: /\/src\// },
    // o Vitest pegaria a versão de servidor, que não põe o estilo global na página
    alias: [
      {
        find: /^styled-components$/,
        replacement: 'styled-components/dist/styled-components.browser.esm.js',
      },
    ],
  },
})
