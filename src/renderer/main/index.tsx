import '../style/base.scss';
import './index.css';
import { createRoot } from 'react-dom/client'
import { Header } from './layout/header/header';
import { Main } from './layout/main/Main';
import { isDark } from 'vitron/client';

const root = createRoot(document.getElementById('root')!)

document.body.classList.add(isDark() ? 'dark-theme' : 'light-theme')

root.render(
  <>
    <Header />
    <Main />
  </>
)
