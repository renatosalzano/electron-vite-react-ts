import { Classname } from './global'

declare global {

  const cls: Classname
  const test: {
    test: boolean
  }

  interface Window {
    test: boolean
  }

}

export { }