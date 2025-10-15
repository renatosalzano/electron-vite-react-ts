import type { OrchestratorApi } from "./src/preload/orchestratorApi"
import type { WebviewApi, ThemeApi } from "./src/client/index.ts"

declare global {
  function bb(str: string): string
  function r(str: string): string
  function g(str: string): string
  function y(str: string): string
  function b(str: string): string
  function m(str: string): string
  function c(str: string): string
  function w(str: string): string
  function R(str: string): string
  function G(str: string): string
  function Y(str: string): string
  function B(str: string): string
  function M(str: string): string
  function C(str: string): string
  function W(str: string): string

  interface Window {
    webview: WebviewApi
    [process.env.THEME_API]: ThemeApi
  }

  namespace NodeJS {
    interface ProcessEnv {
      DEV: string
      BUILD_STATUS: 'START' | 'END' | 'ERROR'
      VITE_DEV_URL: string
      ELECTRON_EXEC_PATH: string
      ELECTRON_STARTED: string
      VITE_DEV_PORT: string
      PRELOAD_STORE_CHANNEL: string

      WEBVIEW: string
      WEBVIEW_CHANNEL: string
      THEME_CHANNEL: string
      THEME_API: string

      APP_RESIZE_CHANNEL: string
      APP_RESIZE_API: string
    }
  }
}




export { }