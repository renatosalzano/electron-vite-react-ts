

import { Store } from 'vitron'

export interface UserData {

}

export const Userdata = Store.create('userdata', () => {

  return {
    mimmo: 'stored'
  }

})