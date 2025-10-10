import esbuild from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, extname, join, resolve } from 'path'

const REG = /var.*?require\("..(\/store\/(.*?))"\);+/gm
const ELECTRON_RENDER_REQUIRE_REG = /var(.*?)=\s+?require\("electron\/renderer"\)/
const VITRON_IMPORT_REG = /(?:(?:var|const|let).*)?(?:import|require)?.*{?.*?}?.*?['"].*?vitron.?.*['"]\)?;?/gm
const STORE_REG = /(?:(?:var|const|let).*)?(?:import|require)?.*{?.*?}?.*?['"].*?store\/(.*?)['"]\)?;?/gm

const IPC_RENDERER = '__electron__ipc__'
const CONTEXT_BRIDGE = '__electron__context_bridge__'

export const build_preload = async (path: string) => {
  console.log(y('build preload file:'), b(path))

  let output = readFileSync(path, 'utf-8')
  let match;
  let create_require = false

  while ((match = STORE_REG.exec(output)) !== null) {
    const [substring, store_name] = match

    output = output.replace(substring, '')
    output += `
    ${CONTEXT_BRIDGE}.exposeInMainWorld('${store_name}', {
      getStore() { ${IPC_RENDERER}.sendSync('${store_name}:sync') }
    });
    `

    create_require = true
  }


  if (create_require) {
    output = `
      var ${IPC_RENDERER} = require('electron/renderer').ipcRenderer;
      var ${CONTEXT_BRIDGE} = require('electron/renderer').contextBridge;
    ` + output
  }

  // while ((match = VITRON_IMPORT_REG.exec(output)) !== null) {
  //   output = output.replace(match[0], '')
  // }

  let result = await esbuild.build({
    stdin: {
      contents: output,
      resolveDir: '.',
      loader: 'ts'
    },
    bundle: true,
    platform: 'node',
    format: "cjs",
    minify: false,
    write: false,
    treeShaking: true,
    external: ['electron'],
    plugins: [
      {
        name: 'vitron-resolve',
        setup(build) {
          build.onResolve({ filter: /^vitron(\/.*)?$/ }, args => {

            if (args.path === 'vitron/preload') {
              return undefined;
            }
            return {
              external: true,
              path: args.path,
            };
          });
        },
      }
    ]
  })

  if (result.outputFiles[0]) {

    let output = new TextDecoder('utf-8').decode(result.outputFiles[0].contents);

    const dir = resolve(process.cwd(), 'out/preload')

    mkdirSync(dir, { recursive: true })

    writeFileSync(
      join(dir, basename(path, extname(path))) + '.js',
      output
    )

  }

  // console.log(result)
}