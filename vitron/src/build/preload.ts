import esbuild from 'esbuild'
import { mkdirSync, writeFileSync } from 'fs'
import { basename, extname, join, resolve } from 'path'

const REG = /var.*?require\("..(\/store\/(.*?))"\);+/gm
const ELECTRON_RENDER_REQUIRE_REG = /var(.*?)=\s+?require\("electron\/renderer"\)/
const VITRON_REQUIRE_REG = /var.*?require.*?vitron.*?\);+/gm
const STORE_REG = /(?:(?:var|const|let).*)?(?:import|require)?.*{?.*?}?.*?['"].*?(store\/.*?)['"]\)?;?/gm

const IPC_RENDERER = '__electron__ipc__'
const CONTEXT_BRIDGE = '__electron__context_bridge__'

export const build_preload = async (path: string) => {

  if (path.endsWith('.d.ts')) return

  let result = await esbuild.build({
    entryPoints: [path],
    bundle: true,
    platform: 'node',
    format: "cjs",
    minify: false,
    write: false,
    external: ['electron']
  })

  if (result.outputFiles[0]) {
    let output = new TextDecoder('utf-8').decode(result.outputFiles[0].contents);

    // const matches = REG.exec(output)
    let match;
    let create_require = false

    while ((match = STORE_REG.exec(output)) !== null) {
      const [substring, store_name] = match;
      console.log(substring, store_name)

      output = output.replace(substring, '')
      output += `
${CONTEXT_BRIDGE}.exposeInMainWorld('${store_name}',{ getStore(){${IPC_RENDERER}.sendSync('${store_name}:sync') }});
`

      create_require = true
    }


    if (create_require) {
      output = `
var ${IPC_RENDERER} = require('electron/renderer').ipcRenderer;
var ${CONTEXT_BRIDGE} = require('electron/renderer').contextBridge;
` + output
    }

    const dir = resolve(process.cwd(), 'out/preload')

    mkdirSync(dir, { recursive: true })

    writeFileSync(
      join(dir, basename(path, extname(path))) + '.js',
      output
    )

  }

  // console.log(result)
}