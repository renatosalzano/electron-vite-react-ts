import { FC, useEffect, useRef, createElement, RefObject, DependencyList } from "react";


type Close = () => void

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

  icon?: string
  label?: string
  partition?: string
  persist?: boolean

  render?: boolean
  dev?: boolean
  borderRadius?: number

  onFocus?: () => void
  onBlur?: () => void
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
  render,
  persist,
  onBlur,
  onFocus,
  ...props
}) => {

  const ref = useRef<HTMLElement>(null)

  // console.log(window.slot)

  if (ref.current === null) {

    window.webview.set(id, 'create', {
      ...props,
      bounds,
      blur: !!onBlur,
      focus: !!onFocus
    })

    if (dev) {
      window.webview.set(id, 'dev')
    }

    window.webview.on((ID, state) => {
      if (ID === id) {

        // if (!state.render) { return }

        switch (state.event) {

          case 'focus': {
            if (onFocus) { onFocus() }
            break
          }

          case 'blur': {

            const close = () => {
              window.webview.set(id, 'close')
            }

            if (onBlur) {
              onBlur()
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

    window.webview.set(id, 'setBounds', { currentBounds })
  }


  useEffect(() => {

    updateBounds()

  }, [bounds])

  function createResizeObserver() {

    const element = ref.current;

    if (element && !props.modal) {

      const observerCallback: ResizeObserverCallback = () => {
        // console.log('dimension changed')
        updateBounds()
      };

      const resizeObserver = new ResizeObserver(observerCallback);
      resizeObserver.observe(element);

      return {
        observe() {
          if (resizeObserver) {
            resizeObserver.observe(element);
          }
        },
        unobserve() {
          if (resizeObserver) {
            resizeObserver.unobserve(element);
          }
        }
      }
    }

  }

  useEffect(() => {


    // onResize()
    let resizeObserver: ReturnType<typeof createResizeObserver>

    if (render === undefined) {
      if (!props.modal) {
        resizeObserver = createResizeObserver()
      }
      window.webview.set(id, 'render', { render: render ?? true })
    }

    return () => {

      if (resizeObserver) {
        resizeObserver.unobserve();
      }

      if (persist) {
        window.webview.set(id, 'render', { render: false })
      } else {
        window.webview.set(id, 'close')
      }

    };
  }, [])


  useEffect(() => {

    let resizeObserver: ReturnType<typeof createResizeObserver>

    if (render !== undefined) {
      window.webview.set(id, 'render', { render })

      if (render) {
        updateBounds()
        resizeObserver = createResizeObserver()
        resizeObserver?.observe()
      } else {

        if (resizeObserver) {
          resizeObserver.unobserve()
        }
      }
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.unobserve()
      }
    }
  }, [render])

  if (render !== undefined) {
    if (render) return createElement(element, { ref, id, className })
    else return null
  }

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
