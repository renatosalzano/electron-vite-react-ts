import './header.css'
import { Button } from '@components/button/Button';
import { FormEvent, useEffect, useRef, useState, type FC } from 'react';
import { useWebviewEffect, WebView } from 'vitron/client';
import { GoKebabHorizontal } from "react-icons/go";
import { Tabs, TabsHandler } from '../tabs/Tabs';
import { useGlobal } from '../../store/useGlobal';
import { useAppState } from '../../store/appState';
import { OptionsWebView } from '@webviews/options';

import { VscChromeMinimize, VscChromeMaximize, VscChromeClose } from "react-icons/vsc"

type Props = {}

export const Header: FC<Props> = () => {

  const tabsHandler = useRef<TabsHandler>({} as TabsHandler)
  const {
    tabs,
    setTabs,
    setCurrentTab,
    renderOptions,
    openOptions
  } = useGlobal()

  const { openSettings } = useAppState()
  const [disabled, setDisabled] = useState(false)

  const openOpt = (evt: FormEvent<HTMLButtonElement>) => {
    openOptions(true)
    setDisabled(true)
  }

  const onChangeTab = (value: string) => {
    setCurrentTab(value)
  }

  const onCloseTab = (value: string) => {

    let currentTab = ''

    setTabs((tabs) => {

      delete tabs[value]

      const firstTab = Object.values(tabs)[0]

      if (firstTab) {
        currentTab = firstTab.value
      }

      return { ...tabs }
    })

    setCurrentTab(currentTab)
  }

  const combinedTabs = []

  useEffect(() => {

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
            onClick={openOpt}
          >
            <GoKebabHorizontal style={{
              transform: 'rotate(90deg)'
            }} />
          </Button>
          {disabled && (
            <div className="control-mask"></div>
          )}
          <OptionsWebView.Provider
            modal
            className='options-position'
            render={renderOptions}
            borderRadius={8}
            dev
            onBlur={() => {
              openOptions(false)
              setTimeout(() => setDisabled(false))
            }}
          />
        </div>
      </div>
      <div className="controls center">
        <Tabs
          ref={tabsHandler}
          tabs={combinedTabs}
          onChange={onChangeTab}
          onCloseTab={onCloseTab}
        />
      </div>
      <div className="drag-area"></div>
      <div className="chrome-controls">
        <Button
          variant='chrome'
        >
          <VscChromeMinimize />
        </Button>
        <Button
          variant='chrome'
        >
          <VscChromeMaximize />
        </Button>
        <Button
          variant='chrome'
          color='danger'
        >
          <VscChromeClose />
        </Button>
      </div>
    </header>
  )
}
