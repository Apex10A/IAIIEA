import React, { forwardRef } from 'react'
import { cn } from '@/utils'

export interface SVGProps extends React.SVGAttributes<SVGSVGElement> {
  asChild?: boolean
  useGsap?: boolean
  children?: React.ReactNode
  href?: string
}

const LoadingSpinner = forwardRef<SVGSVGElement, SVGProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        stroke={props.color ?? '#fff'}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        ref={ref}
        className={cn('size-6 animate-spin', className)} // Added animate-spin class
        {...props}
      >
        <g>
          <circle 
            cx="12" 
            cy="12" 
            r="9.5" 
            fill="none" 
            strokeWidth="3"
            strokeLinecap="round"
          ></circle>
        </g>
      </svg>
    )
  }
)

LoadingSpinner.displayName = 'LoadingSpinner'
export { LoadingSpinner }