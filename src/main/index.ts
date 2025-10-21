import { app, BaseWindow, nativeTheme } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { resolve } from 'path'
import { Store } from 'vitron/store'
import { ViteBrowserWindow, ViteMicaBrowserWindow } from 'vitron/electron'
// import '../store/userdata'

function createWindow() {

  Store.initializer()

  // console.log(__dirname)

  const main = new ViteBrowserWindow({
    width: 1080,
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

  // const opt = new ViteMicaBrowserWindow({
  //   width: 240,
  //   height: 300,
  //   frame: false,
  //   parent: main,
  //   // transparent: true,
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //     preload: resolve(__dirname, '../preload/preload.js')
  //   },
  //   viteConfig: {
  //     // tell to vite how to search index.html
  //     // renderer/main/index.html
  //     root: 'settings'
  //   }
  // })

  // opt.setMicaAcrylicEffect()
  // opt.setSmallRoundedCorner()

  // opt.webContents.openDevTools()

  // main.contentView.addChildView(opt)




  // nativeTheme.themeSource = 'light'


  if (process.platform === 'win32') {

    main.setBackgroundMaterial('mica')

    // main.setRoundedCorner()
    // main.setMicaTabbedEffect()
    // main.setDarkTheme()

    // main.on('blur', () => {
    //   main.setBackgroundMaterial('mica')
    // })
  } else if (process.platform === 'darwin') {
    // main.setVibrancy(transparency ? 'fullscreen-ui' : null)
    main.setVibrancy('fullscreen-ui')
  }

  // main.webContents.openDevTools()

  // test.setPosition(10, 10)

  // const options = new ViteWebContents({
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //     preload: resolve(__dirname, '../preload/preload.js')
  //   },
  //   viteConfig: {
  //     root: 'options',
  //   }
  // })

  // options.setBounds({
  //   x: 100,
  //   y: 100,
  //   width: 100,
  //   height: 100
  // })

  // main.contentView.addChildView(options)

  // options.webContents.openDevTools()

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