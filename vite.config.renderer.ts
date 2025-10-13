import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({

  build: {
    outDir: 'out/renderer',
  },

  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler']
      },
    })
  ],
})