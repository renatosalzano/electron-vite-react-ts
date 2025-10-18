import { FC } from "react"

export const Shape: FC<{ className: string }> = ({
  className
}) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={'shape ' + className}
  >
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M99.999998,-0.000002c.342969,50.000001-50,100-100,100h100v-100Z"
      transform="translate(.000002 0.000002)"
      fill="currentColor"
    />
  </svg>
)