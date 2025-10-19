import { ReactNode } from 'react'
import { Store } from 'vitron/store'
import { WebviewConfig } from './userdata'

export type UiItem = {
  icon?: string | ReactNode
  label: string
  value: string
  active?: boolean
}

export interface Global {
  currentTab: string
  tabs: Record<string, UiItem>
  options: UiItem[]
  renderOptions: boolean
  testWebviews: Record<string, WebviewConfig>
  setTestWebview(id: string, config: WebviewConfig): void
  openOptions(render?: boolean): void
  setTabs(setTabs: (tabs: Record<string, UiItem>) => Record<string, UiItem>): void
  setCurrentTab(id: string): void
  setOptions(setOptions: (options: UiItem[]) => UiItem[]): void
}


export const global = Store.create<Global>('global', (set, get) => ({
  tabs: {},
  options: [],
  renderOptions: false,
  currentTab: '',
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
  setCurrentTab(currentTab) {
    set({ currentTab })
  },

  testWebviews: {},
  setTestWebview(id, config) {
    const { testWebviews } = get()
    testWebviews[id] = {
      ...testWebviews[id],
      ...config
    }
    set((prev) => ({
      ...prev,
      testWebviews: {
        ...prev.testWebviews,
        ...testWebviews
      }
    }))
  },
}))