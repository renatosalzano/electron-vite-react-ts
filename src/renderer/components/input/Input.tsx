import './input.css'

import { ChangeEventHandler, FC, ReactNode, useState } from "react"
import { CommonProps } from "../types"


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

  const [_value, setValue] = useState('')
  const [_active, setActive] = useState(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    const value = evt.target.value

    if (onChange) {
      onChange(id, value)
    } else {
      setValue(value)
    }
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
      {label && <label
        className='text-field-label'
        htmlFor={id}
      >
        {label}
      </label>}
      <input
        id={id}
        value={value ?? _value}
        onChange={handleChange}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        list={`${id}-suggestions`}
      />
      {children}
    </div>
  )
}