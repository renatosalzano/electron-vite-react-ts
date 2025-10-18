import './options.css'
import { forwardRef, useEffect, type FC } from 'react';
import { userdata } from '@store/userdata';
import { global } from '@store/global'
import { useWebviewEffect } from 'vitron/client';

type Props = {}

const useStore = userdata.useClientStore()
const useGlobal = global.useClientStore()

export const Options = forwardRef<HTMLUListElement, Props>((props, ref) => {

  const { setTabs, openOptions } = useGlobal()

  const onClick = (id: string) => {

    setTabs((tabs) => {

      if (!(id in tabs)) {
        tabs[id] = {
          label: id,
          value: id
        }
      }

      for (const _id in tabs) {
        tabs[_id].active = id === _id
      }

      return tabs
    })

    openOptions(false)
  }


  return (
    <ul
      ref={ref}
      className="options"
    >
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
})
