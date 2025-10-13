import type { ElectronStore } from "./ElectronStore.js"
import type { CreateStore, PartialPayload, StoreGetter } from "./index.js"
import { create } from 'zustand'

const store_map = new Map<string, Store<any>>()
const electron_store_map = new Set<ElectronStore>()

class Store<T> {

  name: string
  state: T
  persist?: boolean
  private create_store: CreateStore<T>

  private constructor(name: string, create_store: CreateStore<T>, persist?: boolean) {

    this.name = name
    this.persist = persist
    this.state = create_store(noop, noop as any)
    this.create_store = create_store

    store_map.set(name, this)
  }

  static create<T>(name: string, create_store: CreateStore<T>) {
    return new Store(name, create_store)
  }

  static persist<T>(name: string, create_store: CreateStore<T>) {
    return new Store(name, create_store, true)
  }

  static initializer() {

    const { ElectronStore } = require('vitron/electron')

    store_map.forEach(store => {
      electron_store_map.add(
        ElectronStore.init(store)
      )
    })

  }

  // static expose() {

  //   const { ipcRenderer, contextBridge } = global.require('electron')

  //   electron_store_map.forEach(store => {
  //     contextBridge.exposeInMainWorld(store.name, {
  //       set(partial: any) {
  //         ipcRenderer.send(store.ipc_set, partial)
  //       },
  //       get(key: string) {
  //         return ipcRenderer.sendSync(store.ipc_set, key)
  //       },
  //       onSync(func: Function) {
  //         ipcRenderer.on(
  //           store.name,
  //           (_: any, ...args: any[]) => {
  //             func(...args);
  //           }
  //         );
  //       }
  //     })
  //   })
  // }


  useClientStore() {

    // @ts-ignore
    const api = window[this.name]

    const store = create<T>((set, get) => {

      const setter = (partial: PartialPayload<T>) => {
        set(partial)
        api.set(partial)
      }

      const store = this.create_store(setter, get as StoreGetter<T>)

      const persist_data = JSON.parse(api.get() || '{}')

      // console.log(persist_data)

      return {
        ...store,
        ...persist_data
      }
    })

    api.onSync((partial: PartialPayload<T>) => {
      store.setState(partial)
    })

    return store
  }


  setState(partial: PartialPayload<T>) {

    if (typeof partial === 'function') {
      partial = partial(this.state)
    }

    this.state = {
      ...this.state,
      ...partial
    }
  }


  getState() {
    return this.state
  }
}


function noop() { }

export { Store }