

declare namespace NodeJS {

  interface ProcessEnv {
    DEV: string
    BUILD_STATUS: 'START' | 'END' | 'ERROR'
    VITE_DEV_URL: string
    ELECTRON_EXEC_PATH: string
    ELECTRON_STARTED: boolean
    VITE_DEV_PORT: number
  }


}


