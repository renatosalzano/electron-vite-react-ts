import esbuild from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, extname, join, resolve } from 'path'



export const build_preload = async (path: string) => {
  console.log(y('build preload file:'), b(path))

  await esbuild.build({
    entryPoints: [path],
    outdir: 'out/preload',
    bundle: true,
    platform: 'node',
    format: "cjs",
    minify: false,
    treeShaking: true,
    external: [
      'electron'
    ],
    plugins: [{
      name: 'expose-store',
      setup(build) {
        build.onLoad({ filter: /.ts$/ }, ({ path }) => {
          let contents = readFileSync(path, 'utf-8')
          let dummy = readFileSync(resolve(process.cwd(), 'vitron/dist/build/dummy_preload.js'), 'utf-8')

          contents = dummy + '\n' + contents

          return {
            contents
          }
        })
      },
    }]
  })


  // console.log(result)
}