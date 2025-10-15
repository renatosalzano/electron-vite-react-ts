import { Store } from '../store/Store.js'
import { WebView, WebViewConsumer } from './WebView.js'
import { isDark } from "./isDark.js";


export type SlotCommand = 'create' | 'setBounds' | 'render' | 'css'

export type WebviewApi = {
  set(name: string, command: SlotCommand, props?: any): void
}

export type ThemeApi = {
  isDark(): boolean
}

export {
  Store,
  WebView,
  WebViewConsumer,
  isDark
}