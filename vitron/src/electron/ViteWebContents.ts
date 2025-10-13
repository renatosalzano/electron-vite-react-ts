import { WebContentsView, WebContentsViewConstructorOptions } from "electron";

import { ViteConfig } from "./index.js";
import { existsSync } from "fs";
// import { orchestratorMain } from "../preload/orchestratorMain.js";

export type ViteWebContentsOptions = WebContentsViewConstructorOptions & {
  viteConfig: ViteConfig
}


export class ViteWebContents extends WebContentsView {

  viteConfig: ViteConfig

  constructor(options: ViteWebContentsOptions) {

    const {
      viteConfig,
      ...electrionOptions
    } = options ?? {};

    super(electrionOptions)

    this.viteConfig = viteConfig

    if (process.env.VITE_DEV_URL) {
      this.webContents.loadURL(`${process.env.VITE_DEV_URL}/${viteConfig.root}/index.html`)
    } else {
      // TODO PRODUCTION
    }

  }

}