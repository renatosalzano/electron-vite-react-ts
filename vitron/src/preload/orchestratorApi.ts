export type OrchestratorApi = {
  batch(): string | void
}

export const orchestratorApi = () => {

  const renderer = require('electron/renderer')

  if (process.env.DEV) {
    // show dev keys
    console.log('orchestrator api key:', process.env.CHANNEL_ORCHESTRATOR_API)
    console.log('orchestrator icp:', process.env.CHANNEL_ORCHESTRATOR_RENDER)
  }

  const orchestrator_api: OrchestratorApi = {
    batch() {
      return renderer.ipcRenderer.sendSync(process.env.CHANNEL_ORCHESTRATOR_RENDER)
    }
  }

  // @ts-ignore
  if (process.contextIsolated) {
    renderer.contextBridge.exposeInMainWorld(
      process.env.CHANNEL_ORCHESTRATOR_API,
      orchestrator_api
    )
  } else {
    // @ts-ignore
    window[process.env.CHANNEL_ORCHESTRATOR_API] = orchestrator_api
  }

}