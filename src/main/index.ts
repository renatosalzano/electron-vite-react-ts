import { app, BaseWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { resolve } from 'path'
import { Store, ViteBrowserWindow } from 'vitron'
import '../store/userdata'

function createWindow() {

  Store.initializer()

  const main = new ViteBrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolve(__dirname, '../preload/preload.js')
    },
    appConfig: {
      // this tell to orchestrator to load src/rendered/main/index
      id: 'main'
    }
  })

  // main.webContents.on('dom-ready', () => {
  //   main.show()
  //   main.webContents.openDevTools()

  // })

}

app.whenReady().then(() => {

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BaseWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})