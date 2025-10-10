import { contextBridge } from "electron/renderer";
import { orchestratorApi } from 'vitron/preload'
import '../store/userdata'

orchestratorApi()

if (process.contextIsolated) {
  console.log('context isolated')
  contextBridge.exposeInMainWorld('api', {})
} else {
  console.log('unsafe')
}