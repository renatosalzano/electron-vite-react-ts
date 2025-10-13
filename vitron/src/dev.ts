import { build_main } from "./build/main.js"
import * as vite from 'vite'
import { build_preload } from "./build/preload.js"
import { globSync } from "fs"
import { resolve } from "path"
import { start_electron } from "./start_electron.js"
import * as http from 'http'
import './env.js'
import './utils/color.js'

const MAIN_PATH = 'src/main/**/*'
const STORE_PATH = 'src/store/**/*'
const PRELOAD_PATH = 'src/preload/**/*'
const D_TS = ['**/*.d.ts']

const paths = [
  MAIN_PATH,
  STORE_PATH,
  PRELOAD_PATH
]


const is_watched_file = vite.createFilter(paths, D_TS)

const is_main_file = vite.createFilter(MAIN_PATH)
const is_preload_file = vite.createFilter(PRELOAD_PATH)
const is_store_file = vite.createFilter(STORE_PATH)

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

    const client_server = await vite.createServer({
      root: resolve(process.cwd(), './src/renderer'),
      configFile: resolve(process.cwd(), './vite.config.renderer.ts'),
      build: {
        rollupOptions: {
          input: input
        },
        commonjsOptions: {
          include: [/store/],
        },
      },
      resolve: {
        alias: {
          'store': resolve(process.cwd(), 'src/store')
        }
      },
      server: {
        port: Number(process.env.VITE_DEV_PORT),
        middlewareMode: true,
        hmr: {
          port: 4080
        }
      },
      plugins: [{
        name: 'vitron:html-dev',
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

      // console.log(req.url)
      // qui ho la richiesta di localhost:PORT/main

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