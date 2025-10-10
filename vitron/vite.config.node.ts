import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    ssr: true,
    outDir: 'out/main',
    lib: {
      entry: 'src/main/index.ts',
      formats: ['cjs']
    },
    watch: {
      include: ['src/main/**/*']
    }
  },
})
