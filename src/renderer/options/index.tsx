import '../style/base.css'
import { createRoot } from 'react-dom/client'
import { Options } from './src/Options'
import { isDark } from 'vitron/client'


document.body.classList.add(isDark() ? 'dark-theme' : 'light-theme')

const root = createRoot(document.getElementById('root')!)

root.render(
  <Options />
)