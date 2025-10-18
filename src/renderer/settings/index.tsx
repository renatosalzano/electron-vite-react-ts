import '../style/base.css'
import '../global'
import { createRoot } from 'react-dom/client'
import { Settings } from './settings/Settings'
import { isDark } from 'vitron/client'


document.body.classList.add(isDark() ? 'dark-theme' : 'light-theme')

const root = createRoot(document.getElementById('root')!)

root.render(
  <Settings />
)