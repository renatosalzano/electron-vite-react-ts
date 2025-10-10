import { UserData } from '../store/userdata'

declare global {

  interface Window {
    userdata: { getStore(): void }
  }
}