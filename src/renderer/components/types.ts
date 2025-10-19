import { ReactNode } from "react"

export type Size = 'small' | 'normal' | 'large'
export type Color = 'danger' | 'success' | 'warn' | 'delete'

export type CommonProps = {
  id: string
  value?: string
  label?: ReactNode
  size?: Size
  color?: Color
  disabled?: boolean
  readonly?: boolean
  onChange?(id: string, value: string): void
}