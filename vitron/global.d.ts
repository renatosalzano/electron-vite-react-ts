import type { OrchestratorApi } from "./src/preload/orchestratorApi"
import type { SlotApi } from "./src/client/index.ts"

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
    slot: SlotApi
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

      SLOT_CHANNEL: string
      SLOT_SET_BOUNDS_CHANNEL: string
      SLOT_RENDER: string
    }
  }
}




export { }