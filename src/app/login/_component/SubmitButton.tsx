'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'

export function SubmitButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()

  return (
    <Button
      className={clsx([className, 'relative'])}
      type='submit'
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {children}
      {pending && (
        <ReloadIcon className='mr-2 h-4 w-4 animate-spin absolute right-0' />
      )}
    </Button>
  )
}
