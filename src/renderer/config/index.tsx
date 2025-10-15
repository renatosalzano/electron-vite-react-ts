
import '../style/base.css'
import '../global'
import { createRoot } from 'react-dom/client'
import { Config } from './Config'

const root = createRoot(document.getElementById('root')!)

root.render(
  <Config />
)