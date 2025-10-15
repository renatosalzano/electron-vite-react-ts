import { ThemeApi } from "./index.js"

export const isDark = () => {
  const theme_api: ThemeApi = window.theme_api
  return theme_api.isDark()
}