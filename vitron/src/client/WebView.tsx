import { FC, ReactNode, useEffect, useRef, createElement, CSSProperties } from "react";

export type WebViewProps = {
  id: string
  src: string
  element?: string
  className?: string
  x?: number
  y?: number
  width?: number
  height?: number
  partition?: string,
  render: boolean,
  zIndex?: number
}


const webview_map = new Map<string, any>()


export const WebView: FC<WebViewProps> = ({
  id,
  src,
  x,
  y,
  width,
  height,
  element = 'div',
  className,
  partition,
  render = false,
  zIndex = 0
}) => {

  const ref = useRef<HTMLElement>(null)

  // console.log(window.slot)

  if (ref.current === null) {
    window.webview.set(id, 'create', { src, partition, render, zIndex })
    window.webview.set(id, 'css')
    webview_map.set(id, { x, y, width, height })
  }

  const on_resize = () => {

    const slot = ref.current

    if (!slot) return;

    const bounds = slot.getBoundingClientRect()

    const electron_bounds = {
      x: x ?? Math.round(bounds.x),
      y: y ?? Math.round(bounds.y),
      width: width ?? Math.round(bounds.width),
      height: height ?? Math.round(bounds.height)
    }

    window.webview.set(id, 'setBounds', electron_bounds)
  }

  useEffect(() => {
    window.webview.set(id, 'render', { render })
  }, [render])

  useEffect(() => {

    on_resize()

  }, [x, y, width, height])


  useEffect(() => {
    on_resize()
    addEventListener('resize', on_resize)

    return () => {
      removeEventListener('resize', on_resize)
    }
  }, [])

  return createElement(element, { ref, id, className })
}

export type WebViewConsumerProps = {
  id: string
  style?: CSSProperties
  element?: string
  className?: string
  children: ReactNode
}

export const WebViewConsumer: FC<WebViewConsumerProps> = ({
  id,
  element = 'div',
  className,
  style = {},
  children
}) => {

  const ref = useRef<HTMLElement>(null)

  useEffect(() => {

  }, [])

  if (webview_map.has(id)) {
    return children
  }

  return createElement(element, { ref, id, className })
}