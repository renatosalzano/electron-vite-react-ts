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
  const { currentTab } = useGlobal()

  const webviewProps = settings
    ? {
      id: 'settings',
      src: 'settings',
      render: true
    }
    : {}

  return (
    <main>

      {currentTab === 'settings' && (
        <WebView
          id='settings'
          src='settings'
          className='webview'
          persist
        />
      )}

      {Object.values(webviews).map(({
        id,
        url
      }) => (
        (
          <WebView
            key={id}
            id={id}
            src={url}
            className='webview'
            partition={`persist:${id}`}
            render={currentTab === id}
          // persist
          />
        )
      ))}
    </main>
  )
}
