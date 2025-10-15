export type Size = 'small' | 'normal' | 'large'
export type Color = 'danger' | 'success' | 'warn'

export type CommonProps = {
  id: string
  value?: string
  label?: string
  size?: Size
  color?: Color
  disabled?: boolean
  onChange(id: string, value: string): void
}