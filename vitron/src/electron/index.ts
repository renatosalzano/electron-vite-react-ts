import { ViteBrowserWindow } from "./ViteBrowserWindow.js";
import { ViteWebContents } from "./ViteWebContents.js";

export type ViteConfig = {
  root: string
  boundTarget?: string
}

export {
  ViteBrowserWindow,
  ViteWebContents
}