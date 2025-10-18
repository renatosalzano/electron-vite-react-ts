import { BrowserWindow, ipcMain, Rectangle, webContents } from "electron"
import { ipcCommand, ipcWebViewProps } from "src/client/index.js"
import { ViteWebContents } from "./index.js"
import { resolve } from "path"
import { WebViewProps } from "../client/WebView.js"

function is_url(value: any) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}


const webview_map = new Map<string, ViteWebContents>()

const webview_props_map = new Map<string, Record<string, any>>()

const update_props = (id: string, update: Record<string, any>, event = 'update') => {

  const prev_props = webview_props_map.has(id)
    ? webview_props_map.get(id)
    : {}

  webview_props_map.set(id, {
    ...prev_props,
    ...update,
    event
  })

  return webview_props_map.get(id)!
}


export const ipcWebView = (BrowserWindow: BrowserWindow) => {

  const contentView = BrowserWindow.contentView

  ipcMain.on(process.env.WEBVIEW_CHANNEL, (
    event,
    id: string,
    command: ipcCommand,
    props: ipcWebViewProps
  ) => {

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
        contentView.addChildView(webContent)

        if (props.borderRadius) {
          webContent.setBorderRadius(props.borderRadius)
        }

        webContent.webContents.on('focus', () => {
          console.log(g(`focus:${id}`))

        })

        webContent.webContents.on('blur', () => {
          console.log(g(`blur:${id}`))

          const current_props = webview_props_map.get(id)!

          current_props.event = 'blur'

          webContents
            .getAllWebContents()
            .forEach(webContents => {
              webContents.send(process.env.WEBVIEW_CHANNEL_SYNC, id, current_props)
            })

        })

        webContent.setBackgroundColor('rgba(255, 255, 255, 0)')

        // webContent.webContents.openDevTools()

        webview_map.set(id, webContent)

        break
      }
      case "close": {
        if (webview_map.has(id)) {

          const view = webview_map.get(id)!

          view.webContents.close()
          webview_map.delete(id)
        }
        break
      }
      case "setBounds": {

        if (webview_map.has(id)) {
          const webContent = webview_map.get(id)!

          const bounds: Rectangle = props.currentBounds

          webContent.setBounds(bounds)
        }
        break
      }
      case "render": {

        if (id === 'all' && !props.render) {
          // hide-all
          webview_map.forEach((webContent) => {
            contentView.removeChildView(webContent)
          })
        }

        if (webview_map.has(id)) {
          const webContent = webview_map.get(id)!

          // webContent.setVisible(props.render || false)
          if (props.render) {
            contentView.addChildView(webContent)
            webContent.webContents.focus()
            // console.log('isFocused', webContent.webContents.isFocused())
          } else {
            contentView.removeChildView(webContent)
          }
        }
        break;
      }
      case 'dev': {
        if (webview_map.has(id)) {
          const webContent = webview_map.get(id)!
          webContent.webContents.openDevTools()
        }
        break
      }
    }

    const current_props = update_props(id, props)

    webContents
      .getAllWebContents()
      .forEach(webContents => {

        if (webContents !== event.sender) {
          console.log(g(`sync:${id} [${current_props.event}]`))
          webContents.send(process.env.WEBVIEW_CHANNEL_SYNC, id, current_props)
        }

      })



  })


  ipcMain.on(process.env.WEBVIEW_CHANNEL_GET, (event, id: string) => {

    if (webview_props_map.has(id)) {
      event.returnValue = webview_props_map.get(id)
    }

  })


}
