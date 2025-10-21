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
  setWebview(id: string, config: WebviewConfig | null): void
  getWebview(id: string): WebviewConfig | void
  setCurrentWebview(id?: string): WebviewConfig
}


const userdata = Store.persist<UserData>('userdata', (set, get) => ({
  theme: 'os',
  currentWebview: null,
  webviews: {},
  getWebview(id) {
    const { webviews } = get()
    return webviews[id]
  },
  setWebview(id, config) {
    const { webviews } = get()

    if (config) {

      webviews[id] = {
        ...webviews[id],
        ...config
      }

    } else {

      delete webviews[id]
    }

    set((prev) => ({
      ...prev,
      webviews: {
        ...webviews
      }
    }))

  },
  setCurrentWebview(id) {
    const { webviews } = get()
    const currentWebview = id ? webviews[id] : null

    set({ currentWebview })

    return currentWebview
  }
}))


export { userdata }