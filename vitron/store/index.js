

export class Store {

  static #instance;

  #store = new Map()

  constructor() {

  }

  static get instance() {

    if (!Store.#instance) {
      Store.#instance = new Store()
    }

    return Store.#instance
  }


  static create(name, create) {

    const instance = Store.instance

    instance.set(name, {
      create,
      ipc_get: `${name}:get`,
      ipc_set: `${name}:set`,
      ipc_sync: `${name}:sync`,
      expose() {
        instance.get(name)
      }
    })

  }

  get(key) {

    if (key) {

      return this.#store.get(key)
    }

    return this.#store
  }

  set(key, config) {
    this.#store.set(key, config)
    return this.#store.get(key)
  }

  static init() {
    console.log('STORE INIT')
    console.log(Store.instance.get())
  }

  static expose() {
    console.log(Store.instance)
  }

}