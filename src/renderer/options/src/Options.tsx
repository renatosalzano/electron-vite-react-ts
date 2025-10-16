import './options.css'
import type { FC } from 'react';
import { userdata } from 'store/userdata';
import { global } from 'store/global'

type Props = {}

const useStore = userdata.useClientStore()
const useGlobal = global.useClientStore()

export const Options: FC<Props> = () => {

  const { setTabs } = useGlobal()

  const onClick = (id: string) => {
    setTabs((tabs) => {

      if (!(id in tabs)) {
        tabs[id] = {
          label: id,
          value: id
        }
      }

      return tabs
    })
  }

  return (
    <ul className="options">
      <li
        className='option'
        onClick={() => onClick('settings')}
      >
        Settings
      </li>
      <li
        className='option'
        onClick={() => onClick('customize')}
      >
        Customize
      </li>
    </ul>
  )
}
