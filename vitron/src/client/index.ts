import { connectStore } from "./connect_store.js";
import { Store } from '../store/Store.js'
import { Slot } from './Slot.js'


export type SlotCommand = 'setBounds' | 'render'

export type SlotApi = {
  set(name: string, command: SlotCommand, props?: any): void
}

export {
  Store,
  Slot,
  connectStore
}