import { FC, ReactNode, useEffect, useRef, createElement, CSSProperties, RefObject, EffectCallback, DependencyList } from "react";


type Close = () => void

type BoundValue = 'inherit' | number

export type WebViewProps = {
  id: string
  src: string
  element?: string
  className?: string
  modal?: boolean

  bounds?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }

  partition?: string
  render: boolean
  zIndex?: number
  dev?: boolean
  borderRadius?: number
  closeOnBlur?: boolean
  mountOnRender?: boolean

  onBlur?: (close: Close) => void
}


type WebViewRef = RefObject<HTMLElement> & WebViewProps

const webview_map = new Map<string, WebViewRef>()
const current_webview = new Map<'current', WebViewRef>()





export const WebView: FC<WebViewProps> = ({
  id,
  element = 'div',
  className,
  bounds,
  dev,

  onBlur,
  ...props
}) => {

  const ref = useRef<HTMLElement>(null)

  // console.log(window.slot)

  if (ref.current === null) {

    window.webview.set(id, 'create', {
      ...props,
      bounds,
      onBlur: !!onBlur
    })

    if (dev) {
      window.webview.set(id, 'dev')
    }

    window.webview.on((ID, props) => {

      if (ID === id) {

        console.log(id, props)

        switch (props.event) {
          case 'blur': {

            const close = () => {
              window.webview.set(id, 'close')
            }

            if (onBlur) {
              onBlur(close)
            }

            break
          }
        }

      }
    })
  }


  const updateBounds = () => {
    const element = ref.current
    if (!element) return

    const rect = getRect(element)

    const {
      x,
      y,
      width,
      height
    } = bounds ?? {}

    const currentBounds = {
      x: x ?? rect.x,
      y: y ?? rect.y,
      width: width ?? rect.width,
      height: height ?? rect.height
    }

    console.log(bounds)

    window.webview.set(id, 'setBounds', { currentBounds })
  }


  useEffect(() => {

    updateBounds()

  }, [bounds])


  useEffect(() => {

    window.webview.set(id, 'render', { render: props.render })

  }, [props.render])


  useEffect(() => {
    // onResize()

    const element = ref.current;
    let resizeObserver: ResizeObserver | void

    if (!element) return;

    if (!props.modal) {

      const observerCallback: ResizeObserverCallback = () => {
        // console.log('dimension changed')
        updateBounds()
      };

      resizeObserver = new ResizeObserver(observerCallback);
      resizeObserver.observe(element);

    }


    return () => {
      if (resizeObserver) {
        resizeObserver.unobserve(element);
      }
    };
  }, [])

  return createElement(element, { ref, id, className })
}


type WebViewEffectThis = {
  current?: WebViewRef
}
type Destructor = () => void
type WebViewEffect = (this: WebViewEffectThis) => void | Destructor

export const useWebviewEffect = (effect: WebViewEffect, deps?: DependencyList) => {

  const _effect = useRef<WebViewEffect>(null)

  if (!_effect.current) {
    console.log(webview_map)
    const current = current_webview.get('current')
    _effect.current = () => effect.call({ current })
    console.log('init webview effect')
  }

  useEffect(_effect.current, deps)
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
