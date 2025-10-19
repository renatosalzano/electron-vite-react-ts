import '../style/base.scss'
import '../global'
import { createRoot } from 'react-dom/client'
import { Settings } from './settings/Settings'
import { isDark } from 'vitron/client'
import { userdata } from '@store/userdata'


document.body.classList.add(isDark() ? 'dark-theme' : 'light-theme')

const root = createRoot(document.getElementById('root')!)

root.render(
  <Settings />
)