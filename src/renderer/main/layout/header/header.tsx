import { Button } from 'src/renderer/components/button/Button';
import './header.css'
import { useState, type FC } from 'react';
import { WebView } from 'vitron/client';

type Props = {}

export const Header: FC<Props> = () => {

  const [renderConfig, setRenderConfig] = useState(false)

  const openConfig = () => {
    setRenderConfig(render => !render)
  }

  return (
    <header>
      <div className="controls left">
        <div className="control-with-options">
          <Button
            variant='control'
            onClick={openConfig}
          >
            +
          </Button>
          <div className="options-anchor">
            <WebView
              id="config-webview"
              src='config'
              render={renderConfig}
              zIndex={0}
              width={300}
              height={250}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
