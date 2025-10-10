import { ipcMain } from "electron"

export const orchestratorMain = (id: string) => {
  ipcMain.on(
    process.env.CHANNEL_ORCHESTRATOR_RENDER,
    (event) => {
      event.returnValue = id
    }
  )
}