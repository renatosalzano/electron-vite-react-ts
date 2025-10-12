import { UserData } from '../store/userdata'

declare global {

  type Userdata = UserData

  interface Window {
    userdata: {
      connect(): void
      on_sync(cb: (id: number, partial: any) => void): void
    }
  }
}