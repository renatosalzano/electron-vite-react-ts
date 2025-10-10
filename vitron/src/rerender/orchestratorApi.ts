import channel from '../electron/channel.json' with { type: 'json' };

export const orchestratorApi = () => {

  const contextBridge = require('electron/renderer')
  const ipcRenderer = require('electron/renderer')

  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld(
      channel.orchestrator.api,
      {
        render() {
          return ipcRenderer.sendSync(channel.orchestrator.render)
        }
      }
    )
  }

}