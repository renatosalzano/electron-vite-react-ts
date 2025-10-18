import './main.css'
import { WebView } from 'vitron/client';
import { useEffect, type FC, type ReactNode } from 'react';
import { useAppState } from '../../store/appState';
import { OPTIONS } from 'src/renderer/constant';
import { useGlobal } from '../../store/useGlobal';

type Props = {
}

export const Main: FC<Props> = () => {

  const renderOptions = useGlobal(store => store.renderOptions)

  const { settings } = useAppState()

  const webviewProps = settings
    ? {
      id: 'settings',
      src: 'settings',
      render: true
    }
    : {}

  return (
    <main>
      {settings && (
        <WebView
          id='settings'
          src='settings'
          className='webview'
          render
          dev
        />
      )}
    </main>
  )
}
