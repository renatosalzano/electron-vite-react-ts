import '../style/base.scss'
import { createRoot } from 'react-dom/client'
import { Options } from './options/Options'
import { isDark } from 'vitron/client'
import { global } from '@store/global'
import { OptionsWebView } from '@webviews/options'


document.body.classList.add(isDark() ? 'dark-theme' : 'light-theme')

export const useGlobal = global.useClientStore()

const root = createRoot(document.getElementById('root')!)

root.render(
  <OptionsWebView.Consumer
    bounds={{
      x: 'inherit',
      y: 'inherit'
    }}
    render={(ref) => (
      <Options
        ref={ref}
      />
    )}
  />
)