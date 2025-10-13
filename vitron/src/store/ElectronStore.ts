import { app, ipcMain, webContents } from "electron"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"
import '../utils/color.js'
import { Store } from "./Store.js"
import { PartialPayload } from "./index.js"


export class ElectronStore {

  store: Store<any>
  name: string

  ipc_get: string
  ipc_set: string
  ipc_sync: string
  ipc_connect: string
  path: string

  private constructor(store: Store<any>) {
    this.store = store

    this.name = store.name
    this.ipc_get = `${this.name}:get`
    this.ipc_set = `${this.name}:set`
    this.ipc_sync = `${this.name}:sync`
    this.ipc_connect = `${this.name}:connect`

    if (!process.env.PRELOAD_STORE_CHANNEL) {
      process.env.PRELOAD_STORE_CHANNEL = ''
    } else {
      process.env.PRELOAD_STORE_CHANNEL += ";"
    }

    process.env.PRELOAD_STORE_CHANNEL += `[${[
      this.ipc_get,
      this.ipc_set,
      this.ipc_sync,
      this.ipc_connect
    ].map(s => `"${s}"`).join(',')}]`

    this.path = join(app.getPath('userData'), this.name)


    if (store.persist) {
      this.read_data()
    }


    // #region GET
    ipcMain.on(this.ipc_get, (event) => {
      console.log(y(this.ipc_get + `()`))
      event.returnValue = JSON.stringify(store.getState())
    });


    // #region SET
    ipcMain.on(this.ipc_set, (event, partial) => {

      partial = this.set(partial);
      console.log(y(this.ipc_set), partial)

      try {

        webContents
          .getAllWebContents()
          .forEach(webContents => {

            if (webContents !== event.sender) {
              webContents.send(this.ipc_sync, partial)
            }

          })

        // event.sender.send(store.ipc_sync, store.id, _partial)
        console.log(g(`${this.ipc_sync} -- done`))

      } catch (err) {
        console.log(err)
        console.log(r(`${this.ipc_sync} -- failed`))
      }

    });

  }

  static init(store: Store<any>) {
    new ElectronStore(store)


  }


  read_data() {

    const path = this.path

    try {

      if (existsSync(path)) {

        console.log(y(`${this.name}:read_data`), this.path)

        const file = readFileSync(path, 'utf-8')
        const data = JSON.parse(file)

        this.store.setState(data)

        console.log(data)

        // this.notify(this.store)

      } else {
        this.write_data()
      }

    } catch (error) {
      console.error(error)
    }
  }


  private write_data() {
    const json = JSON.stringify(this.store.getState())
    writeFileSync(this.path, json, 'utf-8')
    console.log(y(`${this.name}:write_data`), this.path)
  }


  // get(key?: keyof T) {

  //   return key
  //     ? this.data[key]
  //     : this.data

  // }


  set(partial: PartialPayload<any>) {

    if (typeof partial === 'function') {
      partial = partial(this.store.getState())
    }

    this.store.setState(partial)

    if (this.store.persist) {
      this.write_data()
    }

    return partial

  }



}