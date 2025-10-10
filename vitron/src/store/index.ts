import { app, ipcMain } from "electron"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import '../utils/color.js'

const store_map = new Map<string, Store<unknown>>()

type StoreSetter<T> = (partial: Partial<T> | ((prev: T) => T)) => void
type StoreGetter<T> = {
  (): T
} & {
  <K extends keyof T>(key?: K): T[K]
}
type CreateStore<T> = (set: StoreSetter<T>, get: StoreGetter<T>) => T

export type BundledStore<T> = {
  getStore(): CreateStore<T>
}

export class Store<T> {

  data: T
  ipc_get: string
  ipc_set: string
  ipc_sync: string
  path: string

  constructor(name: string, store: CreateStore<T>) {

    this.ipc_get = `${name}:get`
    this.ipc_set = `${name}:set`
    this.ipc_sync = `${name}:sync`

    this.path = join(app.getPath('userData'), name)

    this.data = store(this.set as StoreSetter<T>, this.get as StoreGetter<T>)

    store_map.set(name, this as Store<unknown>)
  }

  static initializer() {

    store_map.forEach((store) => {

      store.sync_data()

      ipcMain.on(store.ipc_get, (event, key?: string) => {
        console.log('ipcMain', store.ipc_get, key)
        event.returnValue = store.get(key as any)
      });

      ipcMain.on(store.ipc_set, async (_event, partial) => {
        console.log('ipcMain', store.ipc_set, partial)
        store.set(partial);
      });

      ipcMain.on(store.ipc_sync, (event) => {
        event.returnValue = store.data
        console.log('ipcMain', store.ipc_sync)
      });

    })
    // console.log(store_map)
  }

  static create<T>(name: string, store: CreateStore<T>) {
    return new Store(name, store)
  }

  sync_data() {

    const path = this.path

    try {

      if (existsSync(path)) {

        console.log(g('read data from:'), this.path)

        const file = readFileSync(path, 'utf-8')
        const data = JSON.parse(file)
        this.data = data

        // this.notify(this.store)

      } else {

        this.write_data()
      }

    } catch (error) {
      console.error(error)
    }
  }


  private write_data() {
    const json = JSON.stringify(this.data)
    writeFileSync(this.path, json, 'utf-8')
    console.log(g('write data in:'), this.path)
  }


  get(key?: keyof T) {

    return key
      ? this.data[key]
      : this.data

  }


  set(partial: T) {

    this.data = {
      ...this.data,
      ...partial
    }

    this.write_data()

    // this.notify(partial)

  }


}