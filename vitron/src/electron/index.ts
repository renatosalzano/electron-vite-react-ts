import { ViteBrowserWindow } from "./ViteBrowserWindow.js";
import { ViteWebContents } from "./ViteWebContents.js";
import { ElectronStore } from "../store/ElectronStore.js";

export type ViteConfig = {
  root: string
  boundTarget?: string
}

export {
  ViteBrowserWindow,
  ViteWebContents,
  ElectronStore
}