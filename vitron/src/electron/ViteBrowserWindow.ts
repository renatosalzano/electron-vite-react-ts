import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, WebContentsView } from "electron";
import { ViteWebContents } from "./ViteWebContents.js";
import { ViteConfig } from "./index.js";
import { SlotCommand } from "../client/index.js";
import { resolve } from "path";
// import { orchestratorMain } from "../preload/orchestratorMain.js";

export type ViteBrowserWindowOptions = BrowserWindowConstructorOptions & {
  viteConfig: ViteConfig
}

const slot_map = new Map<string, ViteWebContents>()

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

    ipcMain.on(process.env.SLOT_CHANNEL, (event, id: string, command: SlotCommand, props) => {

      console.log(y(`slot:${id}`), command)
      // console.log(import.meta.dirname)

      switch (command) {
        case "render": {

          if (slot_map.has(id)) return

          const slotContent = new ViteWebContents({
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
              preload: resolve(process.cwd(), 'out/preload/preload.js')
            },
            viteConfig: {
              root: props
            }
          })

          this.contentView.addChildView(slotContent)

          slotContent.webContents.openDevTools()

          slot_map.set(id, slotContent)
          break
        }
        case "setBounds": {

          if (slot_map.has(id)) {
            const slotContent = slot_map.get(id)!
            slotContent.setBounds(props)
          }
          break
        }
      }


    })

    // this.on('resize')

  }

}