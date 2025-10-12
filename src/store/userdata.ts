

import { Store } from 'vitron'

export interface UserData {
  count: number
  increment(): void
}

export const userdata = Store.persist<UserData>('userdata', (set, get) => ({
  count: 0,
  increment() {
    const { count } = get()
    set({ count: count + 1 })
  }
}))