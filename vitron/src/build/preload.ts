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
      connect(ID) {
        return ${IPC_RENDERER}.sendSync('${store_name}:connect', ID);
      },
      set(partial) { ${IPC_RENDERER}.send('${store_name}:set', partial) },
      get(key) { return ${IPC_RENDERER}.sendSync('${store_name}:get', key) },
      on_sync(func) {
        // ${IPC_RENDERER}.removeAllListeners('${store_name}:sync');
        ${IPC_RENDERER}.on(
          '${store_name}:sync',
          (_, ...args) => {
            console.log('${store_name}:sync');
            func(...args);
          }
        );
      }
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