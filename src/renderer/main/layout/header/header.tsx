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
import { UiItem } from '@store/global';

type Props = {}

const api = windowApi()

export const Header: FC<Props> = () => {

  const {
    tabs,
    setTabs,
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
    // setCurrentTab(value)
    setTabs((tabs) => {

      for (const id in tabs) {
        tabs[id].active = tabs[id].value === value
      }

      return { ...tabs }

    })
  }

  const onCloseTab = (value: string, index: number, currentTabs: UiItem[]) => {

    // let currentTab = ''

    setTabs((tabs) => {

      let currentTab = currentTabs[index - 1]

      if (!currentTab) {
        currentTab = currentTabs[0]
      }

      delete tabs[value]

      if (currentTab) {
        tabs[currentTab.value].active = true
      }

      return { ...tabs }
    })

    // setCurrentTab(currentTab)
  }



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
          // dev
          modal
          className='options-position'
          borderRadius={8}
          render={renderOptions}
          onFocus={() => {
            console.log('focus')
            setDisabled(true)
          }}
          onBlur={() => {
            console.log('blur')
            openOptions(false)
            setTimeout(() => setDisabled(false), 100)
          }}
        />
      </div>
      <div className="controls center">
        <Tabs
          tabs={Object.values(tabs)}
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
