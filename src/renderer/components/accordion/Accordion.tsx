import './accordion.css'
import type { FC, ReactElement, ReactNode } from 'react';

type Props = {
  children: ReactNode
}

const AccordionContainer: FC<Props> = ({ children }) => {

  return (
    <div className="accordion">
      {children}
    </div>
  )
}


type ItemProps = {
  children: ReactNode
}

const AccordionItem: FC<ItemProps> = ({
  children
}) => {

  return (
    <div className="accordion-item">
      {children}
    </div>
  )
}


type SummaryProps = {
  children: ReactNode
}

const AccordionSummary: FC<SummaryProps> = ({
  children
}) => {

  return (
    <div className="accordion-summary">
      {children}
    </div>
  )
}

type ContentProps = {
  children: ReactNode
}

const AccordionContent: FC<ContentProps> = ({ children }) => {

  return (
    <div className="accordion-content">
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
