import { Store } from "./Store.js"

export type PartialPayload<T> = Partial<T> | ((prev: T) => T)
export type StoreSetter<T> = (partial: PartialPayload<T>) => void
export type StoreGetter<T> = {
  (): T
} & {
  <K extends keyof T>(key?: K): T[K]
}
export type CreateStore<T> = (set: StoreSetter<T>, get: StoreGetter<T>) => T

export type BundledStore<T> = {
  getStore(): CreateStore<T>
}


export {
  Store
}