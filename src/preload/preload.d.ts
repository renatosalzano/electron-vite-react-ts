import { UserData, WebviewConfig } from '../store/userdata'
import { Classname } from 'src/renderer/global'

declare global {

  type Userdata = UserData
  type WebViewConfig = WebviewConfig

  const cls: Classname

  interface Window {
    userdata: {
      connect(): void
      on_sync(cb: (id: number, partial: any) => void): void
    }
  }
}