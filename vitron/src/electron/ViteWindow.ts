import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

type AppConfig = {
  id: string
}

export type ViteBrowserWindowOptions = BrowserWindowConstructorOptions & {
  appConfig?: AppConfig
}

const APP_DEFAULT: AppConfig = {
  id: 'main'
}

export class ViteBrowserWindow extends BrowserWindow {

  constructor(options?: ViteBrowserWindowOptions) {

    const {
      appConfig = APP_DEFAULT,
      ...electrionOptions
    } = options ?? {};

    super(electrionOptions)

    if (process.env.VITE_DEV_URL) {
      this.loadURL(process.env.VITE_DEV_URL)
    } else {
      // TODO PRODUCTION
    }


  }

}