import '../style/base.css';
import { Header } from './src/layout/header/header';
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)

root.render(
  <>
    <Header />
  </>
)
