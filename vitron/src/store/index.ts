import { app, BrowserWindow, ipcMain, ipcRenderer, webContents, WebContents } from "electron"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import '../utils/color.js'

const store_map = new Map<string, Store<unknown>>()

function get_store_map() { return store_map }

type PartialPayload<T> = Partial<T> | ((prev: T) => T)
type StoreSetter<T> = (partial: PartialPayload<T>) => void
type StoreGetter<T> = {
  (): T
} & {
  <K extends keyof T>(key?: K): T[K]
}
export type CreateStore<T> = (set: StoreSetter<T>, get: StoreGetter<T>) => T

export type BundledStore<T> = {
  getStore(): CreateStore<T>
}


function serialize(object: Record<string, any>) {
  return JSON.stringify(object, (key, value) => {

    if (typeof value === 'function') {
      return value.toString()
    }

    return value
  })
}


export class Store<T> {

  name: string
  data: T
  create_store: CreateStore<T>
  ipc_get: string
  ipc_set: string
  ipc_sync: string
  ipc_connect: string
  path: string
  persist?: boolean

  id?: number

  constructor(name: string, store: CreateStore<T>, persist?: boolean) {

    this.persist = persist

    this.name = name
    this.ipc_get = `${name}:get`
    this.ipc_set = `${name}:set`
    this.ipc_sync = `${name}:sync`
    this.ipc_connect = `${name}:connect`

    this.path = join(app.getPath('userData'), name)

    this.data = store(this.set as StoreSetter<T>, this.get as StoreGetter<T>)
    this.create_store = store

    store_map.set(name, this as Store<unknown>)
    // console.log(g('[store] new Store -->'), store_map)
  }

  static initializer() {

    // console.log(g('[store] initializer -->'), store_map)

    store_map.forEach((store) => {

      console.log(g('[store] init:'), store.name)

      if (store.persist) {
        store.read_data()
      }


      // #region GET
      ipcMain.on(store.ipc_get, (event, key?: string) => {
        console.log(y(store.ipc_get + `(${key || ''})`))
        event.returnValue = JSON.stringify(store.data)
      });


      // #region SET
      ipcMain.on(store.ipc_set, (event, partial) => {

        const _partial = store.set(partial);
        console.log(y(store.ipc_set), partial)

        try {

          webContents
            .getAllWebContents()
            .forEach(webContents => {

              if (webContents !== event.sender) {
                webContents.send(store.ipc_sync, store.id, _partial)
              }

            })

          // event.sender.send(store.ipc_sync, store.id, _partial)
          console.log(g(`${store.ipc_sync} -- done`))

        } catch (err) {
          console.log(err)
          console.log(r(`${store.ipc_sync} -- failed`))
        }

      });


      // #region CONNECT
      ipcMain.on(store.ipc_connect, (event, id) => {

        store.id = id

        event.returnValue = store.create_store.toString()

        console.log(y(store.ipc_connect), `-- ID: ${id}`)
      });

    })
    // console.log(store_map)
  }

  static create<T>(name: string, store: CreateStore<T>) {
    return new Store(name, store)
  }

  static persist<T>(name: string, store: CreateStore<T>) {
    console.log(g('[store]'), 'created', name)
    return new Store(name, store, true)
  }

  read_data() {

    const path = this.path

    try {

      if (existsSync(path)) {

        console.log(y(`${this.name}:read_data`), this.path)

        const file = readFileSync(path, 'utf-8')
        const data = JSON.parse(file)
        this.data = {
          ...this.data,
          ...data,
        }

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
    console.log(y(`${this.name}:write_data`), this.path)
  }


  get(key?: keyof T) {

    return key
      ? this.data[key]
      : this.data

  }


  set(partial: PartialPayload<T>) {

    if (typeof partial === 'function') {
      partial = partial(this.data)
    }

    this.data = {
      ...this.data,
      ...partial
    }

    if (this.persist) {
      this.write_data()
    }

    return partial

  }
}