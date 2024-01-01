'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastDefaultOptions } from '@/lib/toast'

export function Toast({
  message,
  type,
}: {
  message: string
  type: string | undefined
}) {
  const router = useRouter()

  if (type === 'success') toast.success(message, toastDefaultOptions())
  else toast.error(message, toastDefaultOptions({ important: true }))

  router.replace('/login')
  return <></>
}
