import { BrowserWindow, ipcMain, nativeTheme } from "electron";
import { MicaBrowserWindow } from "mica-electron";


export const ipcApp = (main: BrowserWindow | MicaBrowserWindow) => {

  ipcMain.on(process.env.WINDOW_MIN, () => {
    main.minimize()
  })


  ipcMain.on(process.env.WINDOW_MAX, () => {
    if (main.isMaximized()) {
      main.restore();
    } else {
      main.maximize();
    }
  });


  ipcMain.on(process.env.WINDOW_CLOSE, () => {
    main.close();
  });

  ipcMain.on(process.env.THEME_CHANNEL, (event) => {
    event.returnValue = nativeTheme.shouldUseDarkColors
  })




  // main.on('resize', () => {
  //   main.getBounds()

  // })

}


