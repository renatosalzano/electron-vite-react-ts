import { CSSProperties, FC, useEffect, useRef } from "react";

export type SlotProps = {
  id: string
  root: string
  x?: number
  y?: number
  width?: number
  height?: number
}


export const Slot: FC<SlotProps> = ({
  id,
  root,
  x,
  y,
  width,
  height
}) => {

  const ref = useRef<HTMLSlotElement>(null)

  // console.log(window.slot)

  if (ref.current === null) {
    window.slot.set(id, 'render', root)
  }

  const on_resize = () => {

    const slot = ref.current

    if (!slot) return;

    const { x, y, width, height } = slot.getBoundingClientRect()

    const electron_bounds = {
      x: x ?? Math.round(x),
      y: y ?? Math.round(y),
      width: width ?? Math.round(width),
      height: height ?? Math.round(height)
    }

    window.slot.set(id, 'setBounds', electron_bounds)
  }


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

  return (
    <slot
      ref={ref}
      id={id}
    />
  )
}