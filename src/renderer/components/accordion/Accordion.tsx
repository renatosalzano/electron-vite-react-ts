import './accordion.css'
import { Children, cloneElement, createContext, createRef, Dispatch, forwardRef, isValidElement, RefObject, SetStateAction, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, type FC, type ReactElement, type ReactNode } from 'react';

type Props = {
  children: ReactNode
}

type SiblingExtended = {
  top: boolean;
  bottom: boolean;
}

type OnChangeCollapsed = (index: number, collapsed: boolean) => void

type RefHandler = {
  setSiblingExtended: Dispatch<SetStateAction<SiblingExtended>>
}


const AccordionContainer: FC<Props> = ({ children }) => {

  function len() {
    return Children.count(children)
  }

  const ref = useRef({}) as RefObject<{}> & {
    [key: number]: RefObject<RefHandler>
  }

  const onChangeCollapsed: OnChangeCollapsed = (index: number, extended: boolean) => {
    const top = ref[index - 1]
    const bottom = ref[index + 1]

    if (top) {
      top.current.setSiblingExtended((state) => ({ ...state, bottom: extended }))
    }

    if (bottom) {
      bottom.current.setSiblingExtended((state) => ({ ...state, top: extended }))
    }
  }

  return (
    <div className="accordion">
      {Children.map(children, (child, index) => {

        // console.log(child)

        if (isValidElement(child)) {

          const _ref = createRef<RefHandler>()

          ref[index] = _ref

          let accordionClass = ''

          if (index === 0) {
            accordionClass = 'frist '
          }

          if (index === (len() - 1)) {
            accordionClass += 'last '
          }

          if (accordionClass === '') {
            accordionClass = 'middle'
          }

          const props = {
            ...child.props as Record<string, any>,
            ref: _ref,
            index,
            accordionClass,
            onChangeCollapsed
          }

          return cloneElement(child, props)
        }

        return child
      })}
    </div>
  )
}


type ItemProps = {
  open?: boolean
  index?: never
  children: ReactNode
  setCollapsed?: never
  accordionClass?: never

  onChangeCollapsed?: never
}

type accordionContext = {
  collapsed: boolean
  toggleCollapse(): void
}

const AccordionContext = createContext<accordionContext>({} as accordionContext)
const useAccordionContext = () => useContext(AccordionContext)

const AccordionItem: FC<ItemProps> = forwardRef<RefHandler, ItemProps>(({
  open,
  index,
  children,
  accordionClass,
  onChangeCollapsed
}, ref) => {

  const _accordionClass: string = accordionClass as any
  const _onChangeCollapse: OnChangeCollapsed = onChangeCollapsed as any

  const [collapsed, setCollapsed] = useState(!open)
  const [siblingExtendend, setSiblingExtended] = useState({ top: false, bottom: false })

  const toggleCollapse = () => {
    setCollapsed(p => !p)

    _onChangeCollapse(index, collapsed)
  }

  useImperativeHandle(ref, () => ({
    setSiblingExtended,
  }))

  useEffect(() => {

    if (open) {
      _onChangeCollapse(index, collapsed)
    }

  }, [open])

  return (
    <AccordionContext.Provider
      value={{
        collapsed,
        toggleCollapse,
      }}
    >
      <div className={cls('accordion-item', {
        [_accordionClass]: !!_accordionClass,
        'top-is-extended': siblingExtendend.top,
        'bottom-is-extended': siblingExtendend.bottom,
        'collapsed': collapsed,
        'expanded': !collapsed
      })}>
        {children}
      </div>

    </AccordionContext.Provider>
  )
})


type SummaryProps = {
  children: ReactNode
  onClick?(): void
}

const AccordionSummary: FC<SummaryProps> = ({
  children,
  onClick
}) => {

  const {
    toggleCollapse
  } = useAccordionContext()

  const handleClick = () => {

    toggleCollapse()

    if (onClick) onClick()
  }

  return (
    <div
      className="accordion-summary"
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

type ContentProps = {
  children: ReactNode
}

const AccordionContent: FC<ContentProps> = ({ children }) => {

  const {
    collapsed
  } = useAccordionContext()

  return (
    <div
      className={cls("accordion-content", {
        collapsed
      })}
    >
      {children}
    </div>
  )
}



function Accordion(props: Props) {
  return <AccordionContainer {...props} />
}

Accordion.Item = AccordionItem
Accordion.Summary = AccordionSummary
Accordion.Content = AccordionContent

export { Accordion }
