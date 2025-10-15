import { Store } from 'vitron/store'

export type Theme = 'light' | 'dark' | 'os'

export interface WebviewConfig {
  id: string
  label: string
  url: string
  icon: string
}

export interface UserData {
  theme: Theme
  webviews: Record<string, WebviewConfig>
  currentWebview: null | WebviewConfig
  setWebview(id: string, config: WebviewConfig): void
  setCurrentWebview(id?: string): WebviewConfig
}


const userdata = Store.persist<UserData>('userdata', (set, get) => ({
  theme: 'os',
  currentWebview: null,
  webviews: {},
  setWebview(id, config) {
    const { webviews } = get()
    webviews[id] = {
      ...webviews[id],
      ...config
    }
    set({ webviews })
  },
  setCurrentWebview(id) {
    const { webviews } = get()
    const currentWebview = id ? webviews[id] : null

    set({ currentWebview })

    return currentWebview
  }
}))


export { userdata }