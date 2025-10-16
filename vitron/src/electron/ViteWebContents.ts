import { WebContentsView, WebContentsViewConstructorOptions } from "electron";

import { ViteConfig } from "./index.js";
import { existsSync } from "fs";
// import { orchestratorMain } from "../preload/orchestratorMain.js";

export type ViteWebContentsOptions = WebContentsViewConstructorOptions & {
  viteConfig?: ViteConfig
  loadURL?: string
}


export class ViteWebContents extends WebContentsView {

  // viteConfig: ViteConfig

  constructor(options: ViteWebContentsOptions) {

    const {
      viteConfig,
      loadURL,
      ...electrionOptions
    } = options ?? {};

    super(electrionOptions)

    if (viteConfig) {

      if (process.env.VITE_DEV_URL) {
        this.webContents.loadURL(`${process.env.VITE_DEV_URL}/src/renderer/${viteConfig.root}/index.html`)
        // this.webContents.loadURL(`${process.env.VITE_DEV_URL}/${viteConfig.root}/index.html`)
      } else {
        // TODO PRODUCTION
      }

    } else if (loadURL) {
      this.webContents.loadURL(loadURL)
    }

  }

}