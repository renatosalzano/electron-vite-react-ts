import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root'))

const modules = { /* MODULES */ };

const ID = window.__orchestrator__api__.batch()

async function orchestrator() {

  if (modules[ID]) {
    const module = await import(/* @vite-ignore */ modules[ID]);

    if (module.default) {
      root.render(module.default())
    }
  }

}

orchestrator()