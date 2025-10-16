import './header.css'
import { Button } from 'src/renderer/components/button/Button';
import { useEffect, useRef, useState, type FC } from 'react';
import { WebView } from 'vitron/client';
import { GoKebabHorizontal } from "react-icons/go";
import { Tabs, TabsHandler } from '../tabs/Tabs';
import { useGlobal } from '../../store/useGlobal';

type Props = {}

export const Header: FC<Props> = () => {

  const tabsHandler = useRef<TabsHandler>({} as TabsHandler)
  const { tabs } = useGlobal()

  const [renderConfig, setRenderConfig] = useState(false)

  const openConfig = () => {
    setRenderConfig(render => !render)
  }

  const combinedTabs = []

  useEffect(() => {

    console.log(tabs)

    Object
      .values(tabs)
      .forEach(tab => {
        tabsHandler.current.addTab(tab)
      })

  }, [tabs])

  return (
    <header>
      {/* <div className="floating"></div> */}
      <div className="controls left">
        <div className="control-with-options">
          <Button
            variant='control'
            onClick={openConfig}
          >
            <GoKebabHorizontal style={{
              transform: 'rotate(90deg)'
            }} />
          </Button>
          <div className="options-anchor">
            <WebView
              id='Options'
              src='options'
              height={100}
              width={100}
              render
              dev
            />
          </div>
        </div>
      </div>
      <div className="controls center">
        <Tabs
          ref={tabsHandler}
          tabs={combinedTabs}
        />
      </div>
    </header>
  )
}
