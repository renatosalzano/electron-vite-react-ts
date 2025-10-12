import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, WebContentsView } from "electron";
import { ViteWebContents } from "./ViteWebContents.js";
import { ViteConfig } from "./index.js";
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
      this.loadURL(`${process.env.VITE_DEV_URL}/${viteConfig.root}/index.html`)
    } else {
      // TODO PRODUCTION
    }

    // this.on('resize')

  }

}