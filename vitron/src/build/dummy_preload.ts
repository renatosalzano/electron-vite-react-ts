import * as _ from 'electron/renderer'
import type { WebviewApi, ThemeApi } from '../client/index.js'

const store_channels: string[][] = process.env.PRELOAD_STORE_CHANNEL
  .split(';')
  .map((i: string) => JSON.parse(i))

for (const channels of store_channels) {

  const api = {} as Record<string, Function>

  const window_key: string = channels[0].split(':')[0]

  for (const channel of channels) {
    const cmd = channel.split(':')[1]

    switch (cmd) {
      case 'get':
        api.get = () => {
          return _.ipcRenderer.sendSync(channel)
        }
        break
      case 'set':
        api.set = (partial: any) => {
          _.ipcRenderer.send(channel, partial)
        }
        break
      case 'sync':
        api.onSync = (func: Function) => {
          _.ipcRenderer.on(channel, (_evt: any, ...arg: any[]) => {
            func(...arg)
          })
        }
        break
      case 'connect':
        break
    }
  }

  _.contextBridge.exposeInMainWorld(window_key, api)
}

// console.log('WEBVIEW_CHANNEL', process.env.WEBVIEW_CHANNEL)

_.contextBridge.exposeInMainWorld(process.env.WEBVIEW, {
  set(...args) {
    _.ipcRenderer.send(process.env.WEBVIEW_CHANNEL, ...args)
  },
  get(id) {
    return _.ipcRenderer.sendSync(process.env.WEBVIEW_CHANNEL_GET, id)
  },
  on(func: Function) {
    _.ipcRenderer.on(process.env.WEBVIEW_CHANNEL_SYNC, (_evt: any, ...args: any[]) => {
      func(...args)
    })

  }
} as WebviewApi)


_.contextBridge.exposeInMainWorld(process.env.THEME_API, {
  isDark() {
    return _.ipcRenderer.sendSync(process.env.THEME_CHANNEL)
  }
} as ThemeApi)


_.contextBridge.exposeInMainWorld(process.env.WINDOW_API, {
  min() {
    _.ipcRenderer.send(process.env.WINDOW_MIN)
  },
  max() {
    _.ipcRenderer.send(process.env.WINDOW_MAX)
  },
  close() {
    _.ipcRenderer.send(process.env.WINDOW_CLOSE)
  }
})