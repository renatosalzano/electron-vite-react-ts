import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme } from "electron";
import { MicaBrowserWindow } from 'mica-electron'
import { ViteConfig } from "./index.js";
import { ipcWebView } from "./ipcWebView.js";
import { ipcApp } from "./ipcApp.js";
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

    ipcApp(this)
    ipcWebView(this)

  }

}


export class ViteMicaBrowserWindow extends MicaBrowserWindow {

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

    ipcApp(this)
    ipcWebView(this)
  }

}


