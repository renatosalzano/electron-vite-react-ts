import './options.css'
import { forwardRef, RefObject, useEffect, type FC } from 'react';
import { userdata } from '@store/userdata';
import { global, UiItem } from '@store/global'
import { IoSettingsOutline } from 'react-icons/io5';

type Props = {}

const useUserdata = userdata.useClientStore()
const useGlobal = global.useClientStore()

type Ref = HTMLUListElement & {
  updateBounds(): void
}

export const Options = forwardRef<HTMLUListElement, Props>((_props, ref) => {

  const { setTabs, openOptions } = useGlobal()
  const { webviews } = useUserdata()

  const onClick = ({ label, icon = '', value }: UiItem) => {

    setTabs((tabs) => {

      if (!(value in tabs)) {
        tabs[value] = {
          label,
          value,
          icon
        }
      }

      for (const _id in tabs) {
        tabs[_id].active = value === _id
      }

      return tabs
    })

    openOptions(false)
  }

  useEffect(() => {
    console.log('mounted')
  }, [])


  return (
    <ul
      ref={ref}
      className="options"
    >
      <li
        className='option'
        onClick={() => onClick({ label: 'Settings', value: 'settings' })}
      >
        <IoSettingsOutline
          className='icon'
        />
        <span className="label">
          Settings
        </span>
      </li>
      {Object.values(webviews).map((item) => (
        <li
          key={item.id}
          className='option'
          onClick={() => onClick({
            icon: item.icon,
            label: item.label,
            value: item.id
          })}
        >
          <img
            src={item.icon}
            className='icon'
          />
          <span className="label">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  )
})
