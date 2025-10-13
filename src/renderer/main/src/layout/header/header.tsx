import './header.css'
import type { FC } from 'react';
import { userdata } from 'store/userdata';
import { Slot } from 'vitron/client'

type Props = {}

const useStore = userdata.useClientStore()


const Options: FC<Props> = () => {

  const onclick = () => {
    // console.log(useStore.getState())
    useStore.getState().increment()
  }

  return (
    <button
      onClick={onclick}
    >
      increment
    </button>
  )
}

export const Header: FC<Props> = () => {

  const { count } = useStore()

  return (
    <header>
      header
      <div className="button-slot">
        <button>
          open
        </button>
        <Slot
          id='options_1'
          root='options'
        />
      </div>
      <div>
        <Options />
      </div>
    </header>
  )
}
