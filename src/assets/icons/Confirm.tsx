import type { SVGProps } from 'react'

export function Confirm(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='1em'
      height='1em'
      viewBox='0 0 24 24'
      {...props}
    >
      <title>Confirm Icon</title>
      <path
        fill='none'
        stroke='currentColor'
        stroke-dasharray='24'
        stroke-dashoffset='24'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='2'
        d='M5 11L11 17L21 7'
      >
        <animate
          fill='freeze'
          attributeName='stroke-dashoffset'
          dur='0.2s'
          values='24;0'
        />
      </path>
    </svg>
  )
}
