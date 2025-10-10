import { contextBridge } from "electron/renderer";
import { orchestratorApi } from 'vitron'
import '../store/userdata'


orchestratorApi()

if (process.contextIsolated) {
  console.log('context isolated')
  contextBridge.exposeInMainWorld('api', {})
} else {
  console.log('unsafe')
}