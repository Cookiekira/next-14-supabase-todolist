'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { toastDefaultOptions } from '@/lib/toast'

export function Toast({
  message,
  type,
}: {
  message: string
  type: string | undefined
}) {
  useEffect(() => {
    if (type === 'success') toast.success(message, toastDefaultOptions())
    else toast.error(message, toastDefaultOptions({ important: true }))
  }, [message, type])

  return <></>
}
