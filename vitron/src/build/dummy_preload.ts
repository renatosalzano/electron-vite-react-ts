import * as _ from 'electron/renderer'
import type { SlotApi } from '../client/index.js'

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

console.log('SLOT_CHANNEL', process.env.SLOT_CHANNEL)

_.contextBridge.exposeInMainWorld('slot', {
  set(...args) {
    _.ipcRenderer.send(process.env.SLOT_CHANNEL, ...args)
  }
} as SlotApi)