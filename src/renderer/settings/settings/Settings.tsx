import './settings.css'
import { FC, useState } from 'react';
import { Button } from '@components/button/Button';
import { FaRegWindowRestore, FaInfo } from "react-icons/fa";
import { TabsConfig } from '../sections/tabs-config/TabsConfig';

type Props = {}

const TABS_CONFIG = 'tabs'
const INFO = 'info'

const options = [
  {
    id: TABS_CONFIG,
    children: (<>
      <FaRegWindowRestore />
      <span>Tabs</span>
    </>),
  },
  {
    id: INFO,
    children: (<>
      <FaInfo />
      <span>Info</span>
    </>),
  },
]

const components = {
  [TABS_CONFIG]: <TabsConfig />,
  [INFO]: null
}

export const Settings: FC<Props> = () => {

  const [active, setActive] = useState(TABS_CONFIG)

  const onClick = (_event: any, id: string) => {
    setActive(id)
  }

  return (
    <div className='settings'>
      <nav className="navigation">
        {options.map((props) => (
          <Button
            {...props}
            key={props.id}
            variant='side'
            size='normal'
            active={active === props.id}
            onClick={onClick}
          />
        ))}
      </nav>
      <section>
        {components[active]}
      </section>
      <div className="settings-background"></div>
    </div>
  )
}