import { DetailedHTMLProps, FC } from "react"
import './button.css'
import { CommonProps } from "components/types"

type ReactButtonProps = DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
type ButtonProps = ReactButtonProps & Omit<CommonProps, 'id' | 'onChange'> & {
  id?: string
  variant: 'head' | 'control' | 'icon'
}


export const Button: FC<ButtonProps> = ({
  variant,
  color,
  size,
  ...props
}) => {

  return (
    <button
      {...props}
      className={cls(
        'base-button',
        {
          [`variant-${variant}`]: !!variant,
          [`${color}-color`]: !!color,
          [`size-${size}`]: !!size
        }
      )}
    />
  )
}