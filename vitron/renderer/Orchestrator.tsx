import { FC, useEffect, useRef } from "react"

type Props = { modules: Record<string, () => Promise<any>> }

export const Orchestrator: FC<Props> = ({
  modules
}) => {

  const init = useRef<boolean>(null)

  async function load_module() {

    try {
      // console.log(modules)
      const ID = window.__orchestrator__api__.batch() as string
      const key = `./${ID}/index.tsx`

      const loader = modules[key]

      if (modules[key]) {
        const module = await loader()

      }
    } catch (error) {
      console.log(error)
    }

    return true
  }


  if (!init.current) {
    load_module()
    init.current = true;
  }



  return (null)
}





