import { Store } from 'vitron/store'

export interface Global {
  count: number
  increment(): void
}


export const userdata = Store.create<Global>('global', (set, get) => ({
  count: 0,
  increment() {
    const { count } = get()
    set({ count: count + 1 })
  }
}))