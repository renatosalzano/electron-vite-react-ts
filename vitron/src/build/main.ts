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
          'electron/renderer'
        ],
      },
    },
    resolve: {
      alias: {
        'vitron/store': resolve(process.cwd(), './vitron/dist/store/index.js'),
        'vitron/electron': resolve(process.cwd(), './vitron/dist/electron/index.js')
      },
    }
  })
}