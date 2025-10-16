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
  dev?: boolean
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
  zIndex = 0,
  dev
}) => {

  const ref = useRef<HTMLElement>(null)

  // console.log(window.slot)

  if (ref.current === null) {
    window.webview.set(id, 'create', { src, partition, render, zIndex })

    if (dev) {
      window.webview.set(id, 'dev')
    }
    webview_map.set(id, { x, y, width, height })
  }

  const onResize = () => {

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
    if (render) {
      onResize()
    }
    window.webview.set(id, 'render', { render })
  }, [render])

  useEffect(() => {

    onResize()

  }, [x, y, width, height])


  useEffect(() => {
    onResize()
    addEventListener('resize', onResize)

    return () => {
      removeEventListener('resize', onResize)
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