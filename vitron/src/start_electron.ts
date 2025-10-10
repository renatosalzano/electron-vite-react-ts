import { ChildProcess, spawn } from 'child_process';
import { createRequire } from 'module';
import { existsSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

const require = createRequire(import.meta.url);

let electronProcess: ChildProcess | null = null

function getElectronPath() {

  let electronExecPath = process.env.ELECTRON_EXEC_PATH || '';

  if (!electronExecPath) {
    const electronModulePath = dirname(require.resolve('electron'));
    const pathFile = join(electronModulePath, 'path.txt');
    let executablePath;
    if (existsSync(pathFile)) {
      executablePath = readFileSync(pathFile, 'utf-8');
    }
    if (executablePath) {
      electronExecPath = join(electronModulePath, 'dist', executablePath);
      process.env.ELECTRON_EXEC_PATH = electronExecPath;
    }
    else {
      throw new Error('Electron uninstall');
    }
  }
  return electronExecPath;
}

export function start_electron() {

  const index_path = resolve(process.cwd(), './out/main/index.js')

  if (electronProcess) {
    electronProcess.kill()
    electronProcess = null
  }

  electronProcess = spawn(getElectronPath(), [index_path], { stdio: 'inherit' })

  electronProcess.on('close', () => {

    // if (electronProcess) {
    //   electronProcess.kill()
    //   electronProcess = null
    // }

    console.log(g('electron is shut down'))
  })

  process.env.ELECTRON_STARTED = true

  console.log(g('electron is started'))

}