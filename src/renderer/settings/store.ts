import { global } from "@store/global"
import { userdata } from "@store/userdata"

export const useUserdata = userdata.useClientStore()
export const useGlobal = global.useClientStore()