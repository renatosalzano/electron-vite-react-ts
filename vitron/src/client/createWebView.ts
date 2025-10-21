import { FC, createElement, ReactNode, useRef, RefObject, ReactElement, useEffect, useState } from "react";
import { WebView, WebViewProps } from "./WebView.js";
import { ipcWebViewProps } from "./index.js";

type ProviderProps = Omit<WebViewProps, 'id' | 'src'>

type Props = {
  id: string
  mountOnRender?: boolean
  bounds?: {
    x?: number | 'inherit'
    y?: number | 'inherit'
    width?: number | 'inherit'
    height?: number | 'inherit'
  }
  render: (ref: RefObject<any | null>) => ReactElement
}

type ConsumerProps = Omit<Props, 'id'>


const Provider: FC<WebViewProps> = (props) => {

  return createElement(WebView, { ...props })
}


const Consumer: FC<Props> = ({
  id,
  bounds = {},
  render
}) => {

  const initialState = useRef<ipcWebViewProps>(null)
  const ref = useRef<any>(null) as RefObject<any> & {
    updateBounds(): void

  }

  const [rendered, setRender] = useState(false)

  const updateBounds = () => {

    const element = ref.current as HTMLElement | null

    if (element) {

      const { currentBounds } = window.webview.get(id)!

      if (!currentBounds) {
        console.error(window.webview.get(id))
        return
      }

      const rect = getRect(element)

      const _currentBounds = {
        x: bounds.x === 'inherit'
          ? currentBounds.x
          : bounds.x ?? rect.x,
        y: bounds.y === 'inherit'
          ? currentBounds.y
          : bounds.y ?? rect.y,
        width: bounds.width === 'inherit'
          ? currentBounds.width
          : bounds.width ?? rect.width,
        height: bounds.height === 'inherit'
          ? currentBounds.height
          : bounds.height ?? rect.height,
      }

      window.webview.set(id, 'setBounds', {
        currentBounds: _currentBounds
      })
    }

  }

  if (!initialState.current) {


    initialState.current = window.webview.get(id)
    // console.log('init', id, initialState.current)

    window.webview.on((currentID: string, props: any) => {
      // console.log(id, props)

      if (currentID === id) {

        if ('render' in props) {
          setRender(props.render)
        }

      }

    })

    // console.log(initialState.current)
    ref.updateBounds = updateBounds
  }


  useEffect(() => {
    if (rendered) {
      updateBounds()
    }
  }, [rendered])

  // return createElement(children,)
  return (rendered ? render(ref) : null)
}

export const createWebView = (id: string, src: string) => {

  return {
    Provider: (props: ProviderProps) => createElement(Provider, { ...props, id, src }),
    Consumer: (props: ConsumerProps) => createElement(Consumer, { ...props, id })
  }
}

function getRect(element: HTMLElement) {
  const bounds = element.getBoundingClientRect()

  return {
    x: Math.round(bounds.x),
    y: Math.round(bounds.y),
    width: Math.round(bounds.width),
    height: Math.round(bounds.height)
  }
}