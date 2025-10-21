import './main.css'
import { WebView } from 'vitron/client';
import { useEffect, type FC, type ReactNode } from 'react';
import { useAppState } from '../../store/appState';
import { useGlobal } from '../../store/useGlobal';
import { useUserdata } from '../../store/useUserdata';

type Props = {
}

export const Main: FC<Props> = () => {

  const renderOptions = useGlobal(store => store.renderOptions)

  const { settings } = useAppState()
  const { webviews } = useUserdata()
  // const { tabs, currentTab } = useGlobal()
  const tabs = useGlobal(state => state.tabs)

  console.log(tabs)

  // const webviewProps = settings
  //   ? {
  //     id: 'settings',
  //     src: 'settings',
  //     render: true
  //   }
  //   : {}

  return (
    <main>

      {/* {currentTab === 'settings' && (
        <WebView
          id='settings'
          src='settings'
          className='webview'
          persist
        />
      )} */}

      {Object.values(tabs).map(({ active, value }) => {

        if (value === 'settings') {

          return (
            <WebView
              key={value}
              id='settings'
              src='settings'
              className='webview'
              render={active}
              persist
            />
          )
        }
        else if (webviews[value]) {
          const data = webviews[value]
          return (
            <WebView
              key={value}
              id={value}
              src={data.url}
              label={data.label}
              icon={data.icon}
              className='webview'
              partition={`persist:${value}`}
              render={active}
              dev
            />
          )
        }

        return null
      })}
    </main>
  )
}
