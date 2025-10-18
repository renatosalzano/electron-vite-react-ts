import './tabs.css'
import type { FC } from 'react';
import { UiItem } from '@store/global'

type Tab = Omit<UiItem, 'value'> & {
  value?: string
}

type Props = {
  tabs: Partial<UiItem>[]
}

export const Tabs: FC<Props> = ({
  tabs
}) => {

  return (
    <ul className="tabs-container">
      {tabs.map((tab) => (
        <li
          key={tab.label}
          className='tab-item'>
          {tab.label}
        </li>
      ))}
    </ul>
  )
}
