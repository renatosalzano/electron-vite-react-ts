import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, nativeTheme, webContents, WebContentsView } from "electron";
import { ViteWebContents } from "./ViteWebContents.js";
import { ViteConfig } from "./index.js";
import { SlotCommand } from "../client/index.js";
import { resolve } from "path";
// import { orchestratorMain } from "../preload/orchestratorMain.js";

export type ViteBrowserWindowOptions = BrowserWindowConstructorOptions & {
  viteConfig: ViteConfig
}

const webview_map = new Map<string, ViteWebContents>()

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

    const win = this

    ipcMain.on(process.env.WEBVIEW_CHANNEL, (event, id: string, command: SlotCommand, props) => {

      console.log(y(`webview:${id}`), command, props)
      // console.log(import.meta.dirname)

      switch (command) {
        case "create": {

          if (webview_map.has(id)) return

          const config: Record<string, any> = {}

          if (is_url(props.src)) {

            config.loadURL = props.src
          } else {

            config.viteConfig = {
              root: props.src
            }
          }

          const webContent = new ViteWebContents({
            ...config,
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
              partition: props.partition ?? undefined,
              preload: resolve(process.cwd(), 'out/preload/preload.js')
            }
          })

          // webContent.setVisible(props.render || false)
          this.contentView.addChildView(webContent)

          webContent.setBackgroundColor('rgba(255, 255, 255, 0)')

          webContent.webContents.openDevTools()

          webview_map.set(id, webContent)
          break
        }
        case "setBounds": {

          if (webview_map.has(id)) {
            const webContent = webview_map.get(id)!
            webContent.setBounds(props)
          }
          break
        }
        case "render": {
          if (webview_map.has(id)) {
            const webContent = webview_map.get(id)!
            // webContent.setVisible(props.render || false)
            if (props.render) {
              win.contentView.addChildView(webContent)
            } else {
              win.contentView.removeChildView(webContent)
            }
          }
          break;
        }
        case 'css': {
          if (webview_map.has(id)) {
            const webContent = webview_map.get(id)!
            webContent.webContents.executeJavaScript(`
              window.addEventListener('DOMContentLoaded', () => {
                console.log('executeJavaScript')
                const style = document.createElement('style');
                style.textContent = 'body { border-radius: 8px !important; overflow: hidden !important; }';
                style.setAttribute('type', 'text/css');
                document.head.appendChild(style);
              })
            `).catch(error => console.log(error))
          }
        }
      }


    })

    ipcMain.on(process.env.THEME_CHANNEL, (event) => {
      event.returnValue = nativeTheme.shouldUseDarkColors
    })

    // this.on('resize')

  }

}


function is_url(value: any) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}