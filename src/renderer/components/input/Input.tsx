import './input.css'

import { ChangeEventHandler, FC, ReactNode, useState } from "react"
import { CommonProps } from "components/types"


export type TextfieldProps = CommonProps & {
  children?: ReactNode
}


export const Input: FC<TextfieldProps> = ({
  id,
  value,
  label,
  color,
  size = 'normal',
  children = null,
  disabled = false,
  onChange
}) => {

  const [_value, setValue] = useState(value)
  const [_active, setActive] = useState(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const value = evt.target.value
    setValue(value)
    onChange(id, value)
  }

  return (
    <div
      className={cls('text-field', {
        // [`${variant}-button`]: !!variant,
        [`color-${color}`]: !!color,
        [`size-${size}`]: true,
        active: _active,
        disabled
      })}

    >
      <label
        className='text-field-label'
        htmlFor={id}
      >
        {label ?? id}
      </label>
      <input
        id={id}
        value={_value}
        onChange={handleChange}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        list={`${id}-suggestions`}
      />
      {children}
    </div>
  )
}