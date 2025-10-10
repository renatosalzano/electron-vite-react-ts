import { app, BrowserWindow } from 'electron'
import { resolve } from 'path'
import { Store, ViteBrowserWindow } from 'vitron'
import '../store/userdata'

function createWindow() {

  Store.initializer()

  const main = new ViteBrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      // sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolve(__dirname, '../preload/preload.js')
    }
  })

  main.show()
  main.webContents.openDevTools()
}

app.whenReady().then(() => {
  console.log('is ready')
  createWindow()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})