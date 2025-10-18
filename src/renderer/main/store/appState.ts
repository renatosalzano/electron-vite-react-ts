import { create } from "zustand";


type State = {
  settings: boolean
  openSettings(open?: boolean): void
}

export const useAppState = create<State>((set, get) => ({
  settings: false,
  openSettings(open = false) {

    set(prev => {
      prev.settings = open
      console.log('SETTINGS', prev.settings)
      return { ...prev }
    })
  }
}))