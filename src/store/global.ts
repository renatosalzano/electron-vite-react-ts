import { ReactNode } from 'react'
import { Store } from 'vitron/store'

export type UiItem = {
  icon?: string | ReactNode
  label: string
  value: string
  active?: boolean
}

export interface Global {
  tabs: Record<string, UiItem>
  options: UiItem[]
  renderOptions: boolean
  openOptions(render?: boolean): void
  setTabs(setTabs: (tabs: Record<string, UiItem>) => Record<string, UiItem>): void
  setOptions(setOptions: (options: UiItem[]) => UiItem[]): void
}


export const global = Store.create<Global>('global', (set, get) => ({
  tabs: {},
  options: [],
  renderOptions: false,
  openOptions(renderOptions = false) {
    set({ renderOptions })
  },
  setOptions(setOptions) {
    const { options } = get()
    const newOptions = setOptions(options)
    set({ options: newOptions })
  },
  setTabs(setTabs) {
    const { tabs } = get()
    const newTabs = setTabs(tabs)
    set({ tabs: newTabs })
  },

}))