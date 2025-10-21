import './button.css'
import { DetailedHTMLProps, FC, FormEvent, RefObject } from "react"
import { CommonProps } from "@components/types"

type ReactButtonProps = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
type ButtonProps = Omit<ReactButtonProps, 'onClick'> & Omit<CommonProps, 'id' | 'onChange'> & {

  id?: string
  ref?: RefObject<HTMLButtonElement>
  variant: 'head' | 'control' | 'icon' | 'side' | 'contained' | 'chrome' | 'panel'
  shape?: 'round' | 'square'
  active?: boolean
  onClick?(evt: FormEvent<HTMLButtonElement>, id?: string): void
}


export const Button: FC<ButtonProps> = ({
  variant,
  color,
  size,
  shape,
  active = false,
  onClick,
  readonly,
  ...props
}) => {

  const handleClick = (evt: FormEvent<HTMLButtonElement>) => {
    console.log(readonly)
    if (onClick && !readonly) onClick(evt, props.id)
  }

  return (
    <button
      {...props}
      className={cls(
        'base-button',
        {
          [`variant-${variant}`]: !!variant,
          [`${color}-color`]: !!color,
          [`size-${size}`]: !!size,
          [`shape-${shape}`]: !!shape,
          active
        }
      )}

      onClick={handleClick}
    >
    </button>
  )
}