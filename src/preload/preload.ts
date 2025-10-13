import { contextBridge } from "electron/renderer";

console.log(process.env.PRELOAD_STORE_CHANNEL)

if (process.contextIsolated) {
  console.log('context isolated')
  contextBridge.exposeInMainWorld('api', {})
} else {
  console.log('unsafe')
}