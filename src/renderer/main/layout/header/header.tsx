import './header.css'
import { Button } from '@components/button/Button';
import { FormEvent, RefObject, useEffect, useRef, useState, type FC } from 'react';
import { useWebviewEffect, WebView } from 'vitron/client';
import { GoKebabHorizontal } from "react-icons/go";
import { Tabs, TabsHandler } from '../tabs/Tabs';
import { useGlobal } from '../../store/useGlobal';
import { useAppState } from '../../store/appState';
import { OptionsWebView } from '@webviews/options';
import { windowApi } from 'vitron/client'

import { VscChromeMinimize, VscChromeMaximize, VscChromeClose } from "react-icons/vsc"

type Props = {}

const api = windowApi()

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

  const optionsButtonRef = useRef<HTMLButtonElement>(null)

  const openOpt = (evt: FormEvent<HTMLButtonElement>) => {
    // evt.stopPropagation()
    // evt.preventDefault()

    openOptions(!renderOptions)

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

        <Button
          ref={optionsButtonRef}
          variant='control'
          onClick={openOpt}
          readonly={disabled}
        >
          <GoKebabHorizontal style={{
            transform: 'rotate(90deg)'
          }} />
        </Button>

        <OptionsWebView.Provider
          dev
          modal
          className='options-position'
          borderRadius={8}
          render={renderOptions}
          onFocus={() => {
            setDisabled(true)
          }}
          onBlur={() => {
            openOptions(false)
            setTimeout(() => setDisabled(false), 100)
          }}
        />
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
          onClick={api.min}
        >
          <VscChromeMinimize />
        </Button>

        <Button
          variant='chrome'
          onClick={api.max}
        >
          <VscChromeMaximize />
        </Button>

        <Button
          variant='chrome'
          color='danger'
          onClick={api.close}
        >
          <VscChromeClose />
        </Button>
      </div>
    </header>
  )
}
