import { globSync, readFileSync } from 'fs';
import { basename, extname, resolve } from 'path';
import esbuild from 'esbuild'

export async function build_main() {

  const store_files = globSync('src/store/**.*')
    .map((path) => resolve(process.cwd(), path))

  await esbuild.build({
    entryPoints: [resolve(process.cwd(), 'vitron/dist/store/Store.js')],
    outfile: 'out/store/vitron_store.js',
    format: 'cjs',
    plugins: [
      {
        name: 'import-store',
        setup(build) {

          build.onLoad({ filter: /Store\.js$/ }, ({ path }) => {

            let contents = readFileSync(path, 'utf-8')

            for (const path of globSync('src/store/**.*')) {
              const name = basename(path, extname(path))
              contents += `require('./${name}.js');\n`
            }

            return {
              contents
            }
          })
        },
      }
    ]
  })

  // console.log(store_files)
  await esbuild.build({
    entryPoints: store_files,
    bundle: true,
    outdir: 'out/store',
    treeShaking: true,
    format: 'cjs',
    external: [
      'electron',
      'zustand',
      'path',
      'fs',
      'vitron/store',
    ],
    plugins: [
      {
        name: 'vitron-alias',
        setup(build) {
          // Intercetta i percorsi di import/require che iniziano con 'vitron/store'
          build.onResolve({ filter: /^vitron\/store$/ }, args => {
            // Non includere nel bundle
            return {
              path: './vitron_store.js',
              external: true // Mantiene il modulo esterno
            };
          });
        },
      }
    ]
  })


  const result = await esbuild.build({
    entryPoints: [resolve(process.cwd(), 'src/main/index.ts')],
    treeShaking: true,
    bundle: true,
    outfile: 'out/main/index.js',
    format: 'cjs',
    platform: 'node',
    external: [
      'electron',
      'fs',
      'path',
      'vitron/electron',
      'vitron/store',
      'electron/renderer'
    ],
    plugins: [
      {
        name: 'vitron-alias',
        setup(build) {
          // Intercetta i percorsi di import/require che iniziano con 'vitron/store'
          build.onResolve({ filter: /^vitron\/store$/ }, args => {
            // Non includere nel bundle
            return {
              path: '../store/vitron_store.js',
              external: true // Mantiene il modulo esterno
            };
          });
        },
      }
    ]
  })

}