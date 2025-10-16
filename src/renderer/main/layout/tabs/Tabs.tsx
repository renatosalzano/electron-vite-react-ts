import { Button } from 'components/button/Button';
import './tabs.css'
import { createRef, forwardRef, ReactNode, RefObject, useEffect, useImperativeHandle, useRef, useState, type FC } from 'react';
import { IoClose } from "react-icons/io5";

type Props = {
  tabs: TabItem[]
  active?: string
  onChange?(value: string): void
}

export type TabsHandler = {
  addTab(tab: TabItem): void
  setActiveTab(value: string): void
}

type TabItem = {
  label: ReactNode
  value: string
  icon?: string | ReactNode
}

type TabItemList = TabItem & {
  key: string | number
}

type OnChangePosition = (targetIndex: number, targetOffset: number) => void

type OnEnd = () => void

type OnTabClick = (value: string) => void

type TabProps = TabItem & {
  index: number
  active?: boolean
  listRef: RefObject<HTMLUListElement>
  listLen: number
  listPaddingX: number
  onClick: OnTabClick
  onMoveEnd: OnEnd
  onChangePosition: OnChangePosition
}

type TabRef = RefObject<HTMLLIElement> & Partial<TabItem> & {
  isSwiping?: boolean
  threshold?: [number, number]
  start?: number
  offset?: number
  index?: number
  indexOffset?: number
  position?: number
  minOffset?: number
  maxOffset?: number
  emitOnEnd?: boolean
  timer?: NodeJS.Timeout
}

type TabHandler = {
  setPosition(offset: number): void
  getRef(): TabRef
}

const CSS_VAR_OFFSET_X = '--offset-x'
const CSS_VAR_PADDING_X = '--padding-x'
const CSS_PADDING_X = 8
const TAB_SWIPE_DELAY = 100

export const Tabs = forwardRef<TabsHandler, Props>(({
  tabs,
  active,
  onChange
}, _ref) => {

  const ref = useRef<HTMLUListElement>(null)

  const handlerRefs = useRef(null) as Record<string, RefObject<TabHandler>> & RefObject<{}>

  if (handlerRefs.current === null) {

    tabs.forEach((tab, i) => {
      handlerRefs[i] = createRef() as any
    })

    handlerRefs.current = {}
  }

  const [activeTab, setActive] = useState(active)

  const mappedTabs = () => tabs.map((t, i) => ({
    ...t,
    key: i + new Date().getTime(),
  }))

  const [list, setList] = useState<TabItemList[]>(mappedTabs)


  const onTabClick: OnTabClick = (value) => {
    setActive(value)
  }


  const onChangePosition: OnChangePosition = (targetIndex, targetOffset) => {

    // console.table({ targetIndex, targetOffset })
    const from = targetIndex + targetOffset
    const to = targetIndex

    try {
      const A = handlerRefs[from]
      const B = handlerRefs[to]
      // console.log()

      B.current.setPosition(targetOffset)

      handlerRefs[from] = B
      handlerRefs[to] = A

      // console.log(handlerRefs)

    } catch (err) {
      console.log(err)
    }
  }


  const onEnd = () => {

    const sortedTabs: TabItemList[] = []

    setList((prev) => {

      Object
        .values(handlerRefs)
        .filter(handler => (handler.current))
        .map(handler => handler.current.getRef())
        .forEach(ref => {

          const item = prev[ref.index]

          const newItem = {
            ...item,
            key: ref.position + new Date().getTime()
          }

          // console.log(newItem.label, newItem.key === item.key)

          sortedTabs[ref.position] = newItem
        })

      return [...sortedTabs]
    })

    ref.current.style.pointerEvents = 'unset'

  }

  useImperativeHandle(_ref, () => ({
    setActiveTab(value) {
      setActive(value)
    },
    addTab(tab) {
      setList(prev => {

        const tabExist = prev.some((t) => t.value === tab.value)

        if (!tabExist) {
          const index = prev.push({
            ...tab,
            key: prev.length - 1 + new Date().getTime()
          }) - 1

          handlerRefs[index] = createRef() as any
        }

        return [...prev]
      })
    },
  }))


  return (
    <ul
      ref={ref}
      className='tabs'
      style={{
        // @ts-ignore
        [CSS_VAR_PADDING_X]: CSS_PADDING_X + 'px'
      }}
    >
      {list.map((props, i) => (
        <Tab
          {...props}
          ref={handlerRefs[i]}
          key={props.key}

          active={props.value === activeTab}

          index={i}
          listRef={ref}
          listLen={list.length}
          listPaddingX={CSS_PADDING_X}

          onClick={onTabClick}
          onMoveEnd={onEnd}
          onChangePosition={onChangePosition}
        />
      ))}
    </ul>
  )
})

const Tab = forwardRef<TabHandler, TabProps>(({
  label,
  value,
  active,
  index,
  listRef,
  listLen,
  listPaddingX,
  onChangePosition,
  onMoveEnd,
  onClick
}, _ref) => {

  const ref = useRef(null) as TabRef


  const [isDragging, setIsDragging] = useState(false)


  if (!ref.current) {
    ref.index = index
    ref.position = index
    ref.indexOffset = 0
  }


  useImperativeHandle(_ref, () => ({
    setPosition(offset) {
      ref.position += offset
      ref.indexOffset += offset
      setOffset(ref.current, ref.indexOffset, 400)
    },
    getRef() {
      return ref
    },
  }))


  const handleClick = () => {
    onClick(value)
  }


  function clearTimer() {
    if (ref.timer) {
      clearTimeout(ref.timer)
    }
  }


  function onStart(evt: any) {

    onClick(value)

    ref.timer = setTimeout(() => {

      setIsDragging(true)

      ref.isSwiping = true
      ref.start = evt.clientX
      ref.minOffset =
        ref.current.clientWidth * ref.index
        * - 1
        - listPaddingX

      // console.log(evt.clientX)

      let delta = ref.current.clientWidth / 2

      ref.threshold = [-delta, delta]

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onEnd)

      listRef.current.style.pointerEvents = 'none'

      ref.timer = undefined

    }, TAB_SWIPE_DELAY)

    window.addEventListener('pointerup', clearTimer)
  }


  function onMove(evt: any) {

    if (!ref.isSwiping) return;

    const currentX = evt.clientX

    ref.offset = (ref.start - currentX) * -1

    if (ref.position === 0 && ref.offset < ref.minOffset) {
      ref.offset = ref.minOffset
    }

    // console.log(ref.threshold)

    if (ref.offset > ref.threshold[1]) {

      const nextPosition = ref.position + 1

      if (nextPosition < listLen) {
        console.log('next')

        ref.threshold[0] += ref.current.clientWidth
        ref.threshold[1] += ref.current.clientWidth
        ref.position += 1
        ref.indexOffset += 1
        ref.emitOnEnd = true
        onChangePosition(ref.position, -1)
      }

    } else if ((ref.offset < ref.threshold[0])) {

      const nextPosition = ref.position - 1

      if (nextPosition >= 0) {
        ref.threshold[0] -= ref.current.clientWidth
        ref.threshold[1] -= ref.current.clientWidth
        ref.position = nextPosition
        ref.indexOffset -= 1
        ref.emitOnEnd = true
        onChangePosition(ref.position, +1)

        if (ref.position === 0) {

          // ref.start = currentX

          let delta = ref.current.clientWidth / 2
          ref.threshold = [-delta, delta]
        }
      }

    }

    // if (row.isOpen) {
    //   row.offset -= 50
    // }
    // console.log('move', row.offset)

    ref.current.style.setProperty(CSS_VAR_OFFSET_X, `${ref.offset}px`)

    // setOffset(() => row.offset)

  }

  function onEnd() {

    setIsDragging(false)

    // if (!ref.emitOnEnd) {
    //   ref.current.style.pointerEvents = 'unset'
    //   return
    // }
    // console.log('end', row.offset)

    const transition = 200

    setOffset(ref.current, ref.indexOffset, transition)

    ref.isSwiping = false

    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onEnd)

    setTimeout(onMoveEnd, transition + 100)
  }

  return (
    <li
      ref={ref}
      onMouseDown={onStart}
      onClick={handleClick}
      className={cls('tab', {
        active,
        'is-dragging': isDragging
      })}
    >
      <div className="content">
        <span
          className='label'
        >
          {label}
        </span>
        <Button
          variant='icon'
          size='small'
        >
          <IoClose />
        </Button>
      </div>
    </li>
  )
})


function getBounds(element: HTMLElement) {
  const bounds = element.getBoundingClientRect()
  return bounds
}


function setOffset(element: HTMLElement, offset: number, transition?: number) {
  // console.log(element)
  if (transition) {
    element.style.transition = `transform ${transition}ms`;
  }
  const x = element.clientWidth * offset
  // console.log(offset, x)
  element.style.setProperty(CSS_VAR_OFFSET_X, `${x}px`)
}