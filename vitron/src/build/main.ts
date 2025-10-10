import { resolve } from 'path';
import * as vite from 'vite';

export async function build_main() {


  return await vite.build({
    build: {
      minify: process.env.DEV ? false : true,
      outDir: 'out/main',
      lib: {
        entry: resolve(process.cwd(), 'src/main/index.ts'),
        formats: ['cjs'],
        fileName: 'index'
      },
      rollupOptions: {
        preserveSymlinks: true,
        treeshake: false,
        external: [
          'electron',
          'fs',
          'path',
          'vitron',
          'electron/renderer'
        ],
      },
    },
    resolve: {
      alias: {
        // 'vitron' deve puntare al file di ingresso (entry point) del tuo modulo.
        'vitron': resolve(import.meta.dirname, './dist/index.js'), // o './vitron/dist/index.js'
      },
    },
    optimizeDeps: {
      include: ['vitron']
    }
  })
}