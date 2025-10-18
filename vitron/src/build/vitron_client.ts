import esbuild from 'esbuild'
import { resolve } from 'path'

export const build_vitron_client = async () => {

  return await esbuild.build({
    entryPoints: [resolve(process.cwd(), 'vitron/dist/client/index.js')],
    outdir: 'out/vitron/client',
    bundle: true,
    format: 'esm',
    external: [
      'react',
      'zustand'
    ]
  })
}