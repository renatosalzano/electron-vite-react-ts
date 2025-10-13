import './options.css'
import type { FC } from 'react';
import { userdata } from 'store/userdata';

type Props = {}

const useStore = userdata.useClientStore()

export const Options: FC<Props> = () => {

  const { count } = useStore()

  const onclick = () => {
    // console.log(useStore.getState())
    useStore.getState().increment()
  }

  return (
    <>
      <button
        onClick={onclick}
      >
        increment
      </button>
      <span>
        counter: {count}
      </span>

    </>
  )
}
