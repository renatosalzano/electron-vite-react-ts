import { build_main } from "./build/main.js"
import * as vite from 'vite'
import { build_preload } from "./build/preload.js"
import { existsSync, globSync, readFileSync } from "fs"
import { join, relative, resolve } from "path"
import { start_electron } from "./start_electron.js"
import * as http from 'http'
import './env.js'
import './utils/color.js'
import { build_vitron_client } from "./build/vitron_client.js"
// import { parse_tsconfig } from "./build/tsconfig.js"

// import tsconfigPaths from 'vite-tsconfig-paths'

const MAIN_PATH = 'src/main/**/*'
const STORE_PATH = 'src/store/**/*'
const PRELOAD_PATH = 'src/preload/**/*'
const TSCONFIG_RENDERER_PATH = 'tsconfig.renderer.json'
const D_TS = ['**/*.d.ts']

const paths = [
  MAIN_PATH,
  STORE_PATH,
  PRELOAD_PATH,
]

// let tsconfig = parse_tsconfig(resolve(process.cwd(), './tsconfig.renderer.json'))
// let tsconfig_prefixes_map = new Map<string, string>()

// const is_tsconfig_file = (source: string) => {
//   return tsconfig.prefixes.some((prefix) => {
//     const ret = source.includes(prefix)
//     if (ret) {
//       tsconfig_prefixes_map.set(source, prefix)
//     }
//     return ret
//   })
// }


const is_watched_file = vite.createFilter(paths, D_TS)

const is_main_file = vite.createFilter(MAIN_PATH)
const is_preload_file = vite.createFilter(PRELOAD_PATH)
const is_store_file = vite.createFilter(STORE_PATH)

const is_tsconfig_renderer_file = vite.createFilter(TSCONFIG_RENDERER_PATH)

async function rebuild(server: vite.ViteDevServer, file_path: string) {

  if (is_watched_file(file_path)) {

    // console.log(y('rebuild'), basename(file_path))

    if (is_main_file(file_path) || is_store_file(file_path)) {
      await build_main()
    }

    // console.log('is change')
    if (is_preload_file(file_path)) {
      await build_preload(file_path)
    }

    start_electron()
  }
}

export async function dev() {

  process.env.DEV = 'true'
  process.env.BUILD_STATUS = 'START'
  process.env.VITE_DEV_PORT = '4090'


  try {

    await build_main()
    await build_vitron_client()

    const builder = await vite.createServer({
      build: {
        watch: {
          include: paths,
          exclude: ['node_modules', 'vitron']
        }
      },
      plugins: [
        {
          name: 'watcher',
          configureServer(server) {
            server.watcher.on('add', (path) => rebuild(server, path))
            server.watcher.on('unlink', (path) => rebuild(server, path))
            server.watcher.on('change', (path) => rebuild(server, path))
          },
          buildStart() {
            const files = globSync(PRELOAD_PATH)

            for (const path of files) {
              const abs_path = resolve(process.cwd(), path)

              if (is_watched_file(abs_path)) {
                build_preload(abs_path)
              }
            }

          }
        }
      ]
    })

    await builder.listen()

    const input = globSync('src/renderer/*/index.html')
      .map((path) => resolve(process.cwd(), path))


    // const renderer_src = resolve(process.cwd(), 'src/renderer')


    const client_server = await vite.createServer({
      root: resolve(process.cwd()),
      configFile: resolve(process.cwd(), './vite.config.renderer.ts'),
      appType: 'mpa',
      ssr: {
        external: ['vitron/client']
      },
      build: {
        rollupOptions: {
          input: input
        }
      },
      server: {
        port: Number(process.env.VITE_DEV_PORT),
        middlewareMode: true,
        hmr: {
          port: 4080
        }
      },

      plugins: [
        {
          name: 'vitron:dev',
          enforce: 'pre',
          transformIndexHtml() {
            return [{
              tag: 'meta',
              attrs: {
                'http-equiv': 'Content-Security-Policy',
                'contents': `
                  default-src 'self';
                  connect-src 'self' ws://localhost:4080;
                  script-src 'self';
                  style-src 'self' 'unsafe-inline';
                  img-src 'self' data:"
              `
              }
            }]
          }
        }]
    })

    const app = http.createServer(async (req, res) => {

      // console.log('---- req ----')
      // console.log(req.url)

      client_server.middlewares(req, res, () => {
        console.log('not found:', req.url)
        res.statusCode = 404;
        res.end('404');
      });

    })

    app.listen(Number(process.env.VITE_DEV_PORT))

    process.env.VITE_DEV_URL = `http://localhost:${process.env.VITE_DEV_PORT}`

    console.log(g('vite server listen to:'), process.env.VITE_DEV_URL)

    start_electron()


  } catch (error) {
    console.log(error)
  }
}