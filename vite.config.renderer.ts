import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({

  build: {
    outDir: 'out/renderer',
  },

  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler']
      },
    })
  ],
})