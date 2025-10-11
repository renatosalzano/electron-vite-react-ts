import { globSync, readFileSync } from "fs"
import { dirname, resolve } from "path"
import type { PluginOption } from "vite"


export function vite_orchestrator(): PluginOption {

  return {
    name: 'vitron-orchestrator',
    enforce: 'pre',
    resolveId(id, importer) {
      // console.log(id, importer)
      if (id === '/orchestrator.js') {
        return { id: '/orchestrator' }
      }
    },
    load(id, options) {
      if (id === '/orchestrator') {
        const code = readFileSync(
          resolve(process.cwd(), 'vitron/dist/renderer/orchestrator.js'),
          'utf-8'
        )
        return code
      }
    },
    transform(code, id) {
      if (id === '/orchestrator') {
        const files = globSync('src/renderer/*/index.{js,jsx,tsx}')

        const modules = files.map((path) => {
          path = path
            .replace(/\\/g, '/')
            .replace('src/renderer/', '')
          return `${dirname(path)}: './${path}'`
        })

        code = code.replace('/* MODULES */', modules.join(',\n'))

        return {
          code,
          map: null
        }
      }
    },
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: '/orchestrator.js'
          },
          injectTo: 'body'
        }
      ]
    }
  }
}