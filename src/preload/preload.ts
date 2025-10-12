import { contextBridge } from "electron/renderer";
import '../store/userdata'

if (process.contextIsolated) {
  console.log('context isolated')
  contextBridge.exposeInMainWorld('api', {})
} else {
  console.log('unsafe')
}