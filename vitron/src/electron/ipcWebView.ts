import { type Rectangle, BrowserWindow, ipcMain, webContents, Notification } from "electron"
import { ipcCommand, ipcWebViewProps } from "src/client/index.js"
import { ViteWebContents } from "./index.js"
import { resolve } from "path"

function is_url(value: any) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function dummy_notification(id: string) {
  return `
window.Notification = class {

  constructor(title, options) {
    console.log(title, options)
    window.${process.env.WEBVIEW}.notify('${id}', title, JSON.stringify(options))
  }

  async requestPermission() {
    return 'granted';
  }
}

console.log('override Notification')
`
}


const view_map = new Map<string, ViteWebContents>()

const view_state_map = new Map<string, ipcWebViewProps>()

const update_state = (id: string, update: Record<string, any>, event = 'update') => {

  const prev_props = view_state_map.has(id)
    ? view_state_map.get(id)!
    : {} as ipcWebViewProps

  view_state_map.set(id, {
    ...prev_props,
    ...update,
    event
  })

  return view_state_map.get(id)!
}


export const ipcWebView = (main: BrowserWindow) => {

  const contentView = main.contentView

  main.webContents.on('did-finish-load', () => {
    main.webContents.executeJavaScript(dummy_notification('APP'))
  })

  ipcMain.on(process.env.WEBVIEW_CHANNEL_NOTIFICATION, (event, id, title, options) => {
    console.log(y(`notify:${id}`))
    console.log(title, options)

    const state = view_state_map.get(id)! ?? {}

    const _options = JSON.parse(options ?? '{}')

    console.log(_options)

    new Notification({
      title,
      body: 'body della notifica'
    }).show()
  })

  ipcMain.on(process.env.WEBVIEW_CHANNEL, (
    event,
    id: string,
    command: ipcCommand,
    props: ipcWebViewProps
  ) => {

    console.log(y(`webview:${id}`), command, props ?? '--')
    // console.log(import.meta.dirname)


    switch (command) {

      case "create": {

        if (view_map.has(id)) return

        const config: Record<string, any> = {}

        if (is_url(props.src)) {

          config.loadURL = props.src
        } else {

          config.viteConfig = {
            root: props.src
          }
        }

        const view = new ViteWebContents({
          ...config,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            partition: props.partition ?? undefined,
            preload: resolve(process.cwd(), 'out/preload/preload.js')
          }
        })

        // webContent.setVisible(props.render || false)
        // contentView.addChildView(webContent)

        if (props.borderRadius) {
          view.setBorderRadius(props.borderRadius)
        }

        // TODO props.notification

        // view.webContents.on('did-finish-load', () => {

        //   view.webContents.executeJavaScript(dummy_notification(id))
        // })

        view.webContents.on('focus', () => {

          console.log(g(`focus:${id}`))

          const state = view_state_map.get(id)!

          state.event = 'focus'

          webContents
            .getAllWebContents()
            .forEach(webContents => {
              webContents.send(process.env.WEBVIEW_CHANNEL_SYNC, id, state)
            })
        })


        view.webContents.on('blur', () => {

          console.log(g(`blur:${id}`))

          const state = view_state_map.get(id)!
          state.event = 'blur'

          webContents
            .getAllWebContents()
            .forEach(webContents => {
              webContents.send(process.env.WEBVIEW_CHANNEL_SYNC, id, state)
            })

        })


        view.setBackgroundColor('rgba(0, 0, 0, 0)')

        view_map.set(id, view)

        break
      }

      case "close": {

        if (view_state_map.has(id)) {
          view_state_map.delete(id)
        }

        if (view_map.has(id)) {

          const view = view_map.get(id)!

          view.webContents.close()
          view_map.delete(id)

        }
        break
      }

      case "setBounds": {

        if (view_map.has(id)) {
          const webContent = view_map.get(id)!

          const bounds: Rectangle = props.currentBounds

          webContent.setBounds(bounds)
        }
        break
      }

      case "render": {

        if (id === 'all' && !props.render) {
          // hide-all
          view_map.forEach((webContent) => {
            contentView.removeChildView(webContent)
          })
        }

        if (view_map.has(id)) {
          const view = view_map.get(id)!

          const state = view_state_map.get(id)

          // main.focusable = false
          // webContent.setVisible(props.render || false)
          if (props.render) {
            contentView.addChildView(view)

            view.webContents.focus()

          } else {
            contentView.removeChildView(view)
          }
        }
        break;
      }

      case "ready": {

        if (view_state_map.has(id)) {
          // const state = view_state_map.get(id)!
          update_state(id, { ready: true })
        }

        break
      }

      case "dev": {
        if (view_map.has(id)) {
          const webContent = view_map.get(id)!
          webContent.webContents.openDevTools()
        }
        break
      }
    }

    const current_props = update_state(id, props)
    console.log(g(`sync:${id} [${current_props.event}]`))

    webContents
      .getAllWebContents()
      .forEach(webContents => {

        if (webContents !== event.sender) {
          webContents.send(process.env.WEBVIEW_CHANNEL_SYNC, id, current_props)
        }

      })



  })


  ipcMain.on(process.env.WEBVIEW_CHANNEL_GET, (event, id: string) => {

    if (view_state_map.has(id)) {
      event.returnValue = view_state_map.get(id)
    }

  })


}
