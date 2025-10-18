import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme } from "electron";
import { ViteConfig } from "./index.js";
import { ipcWebView } from "./ipcWebView.js";
// import { orchestratorMain } from "../preload/orchestratorMain.js";

export type ViteBrowserWindowOptions = BrowserWindowConstructorOptions & {
  viteConfig: ViteConfig
}



export class ViteBrowserWindow extends BrowserWindow {

  viteConfig: ViteConfig

  constructor(options: ViteBrowserWindowOptions) {

    const {
      viteConfig,
      ...electrionOptions
    } = options ?? {};

    super(electrionOptions)

    this.viteConfig = viteConfig

    if (process.env.VITE_DEV_URL) {
      this.loadURL(`${process.env.VITE_DEV_URL}/src/renderer/${viteConfig.root}/index.html`)
      // this.loadURL(`${process.env.VITE_DEV_URL}/${viteConfig.root}/index.html`)
    } else {
      // TODO PRODUCTION
    }

    ipcWebView(this)


    ipcMain.on(process.env.THEME_CHANNEL, (event) => {
      event.returnValue = nativeTheme.shouldUseDarkColors
    })

    // this.on('resize')

  }

}


