
import { create } from 'zustand'

type StoreApi = {
  connect(id: number): string
  set(partial: any): void
  get(key?: string): any
  on_sync(cb: (id: string, partial: any) => void): void
}

export const connectStore = <T>(storeApi: StoreApi) => {

  console.log(storeApi)

  const ID = new Date().getDate()

  const create_store_serialized = storeApi.connect(ID)

  const create_store_fn = Function(`return ${create_store_serialized}`)()

  const initial_state = JSON.parse(storeApi.get() || '{}')

  // console.log('init state', initial_state)

  const store = create<T>((set, get) => {

    const setter = (partial: any) => {
      set(partial)
      storeApi.set(partial)
    }

    const store = create_store_fn(setter, get)

    return {
      ...store,
      ...initial_state
    }

  })

  storeApi.on_sync((id, partial) => {
    console.log('on sync', id)
    console.log(partial)

    setTimeout(() => store.setState(partial))

  })


  return store
}