import { app, BaseWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { resolve } from 'path'
import { Store } from 'vitron/store'
import { ViteBrowserWindow, ViteWebContents } from 'vitron/electron'
import '../store/userdata'

function createWindow() {

  Store.initializer()


  const main = new ViteBrowserWindow({
    width: 900,
    height: 670,
    frame: false,
    // transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolve(__dirname, '../preload/preload.js')
    },
    viteConfig: {
      // tell to vite how to search index.html
      // renderer/main/index.html
      root: 'main'
    }
  })


  if (process.platform === 'win32') {
    // main.setBackgroundMaterial(transparency ? 'acrylic' : 'none')
    main.setBackgroundMaterial('acrylic')
  } else if (process.platform === 'darwin') {
    // main.setVibrancy(transparency ? 'fullscreen-ui' : null)
    main.setVibrancy('fullscreen-ui')
  }

  const options = new ViteWebContents({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: resolve(__dirname, '../preload/preload.js')
    },
    viteConfig: {
      root: 'options',
    }
  })

  options.setBounds({
    x: 100,
    y: 100,
    width: 100,
    height: 100
  })

  main.contentView.addChildView(options)

  options.webContents.openDevTools()

  // main.orchestrator()


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