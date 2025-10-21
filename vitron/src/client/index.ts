import { WebView, WebViewProps, useWebviewEffect } from './WebView.js'
import { createWebView } from './createWebView.js';
import { isDark } from "./isDark.js";
import { windowApi } from './windowApi.js';

export type ipcCommand =
  | 'create'
  | 'setBounds'
  | 'render'
  | 'dev'
  | 'close'
  | 'ready'

export type WebViewEvents =
  | 'update'
  | 'focus'
  | 'blur'

export type ipcWebViewProps = WebViewProps & {
  event: string
  destroy?: boolean
  render?: boolean
  ready?: boolean
  blur?: boolean
  focus?: boolean
  currentBounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

type ReceiverProps = ipcWebViewProps & {
  event: WebViewEvents
}

export type WebviewApi = {
  set(id: string, command: ipcCommand, props?: any): void
  get(id: string): ipcWebViewProps
  on(callback: (id: string, props: ReceiverProps) => void): void
}

export type ThemeApi = {
  isDark(): boolean
}

export type WindowApi = {
  min(): void
  max(): void
  close(): void
}

export {
  WebView,
  useWebviewEffect,
  createWebView,
  isDark,
  windowApi
}