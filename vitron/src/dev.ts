import { build_main } from "./build/main.js"
import * as vite from 'vite'
import { build_preload } from "./build/preload.js"
import { globSync } from "fs"
import { basename, resolve } from "path"
import { start_electron } from "./start_electron.js"
import './utils/color.js'

const MAIN_PATH = 'src/main/**/*'
const STORE_PATH = 'src/store/**/*'
const PRELOAD_PATH = 'src/preload/**/*'

const paths = [
  MAIN_PATH,
  STORE_PATH,
  PRELOAD_PATH
]


const is_watched_file = vite.createFilter(paths)

const is_main_file = vite.createFilter(MAIN_PATH)
const is_preload_file = vite.createFilter(PRELOAD_PATH)
const is_store_file = vite.createFilter(STORE_PATH)

async function rebuild(server: vite.ViteDevServer, file_path: string) {

  if (is_watched_file(file_path)) {

    console.log(y('rebuild'), basename(file_path))

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
  process.env.VITE_DEV_PORT = 4090


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
              build_preload(resolve(process.cwd(), path))
            }
          }
        }
      ]
    })

    await builder.listen()

    const client_server = await vite.createServer({
      root: resolve(process.cwd(), './src/renderer'),
      configFile: resolve(process.cwd(), './vite.config.renderer.ts'),
      server: {
        port: process.env.VITE_DEV_PORT
      }
    })

    process.env.VITE_DEV_URL = `http://localhost:${process.env.VITE_DEV_PORT}`

    await client_server.listen()

    console.log(g('vite server listen to:'), process.env.VITE_DEV_URL)

    start_electron()


  } catch (error) {
    console.log(error)
  }
}