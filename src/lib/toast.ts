import type { ExternalToast } from 'sonner'

export function toastDefaultOptions(options?: ExternalToast): ExternalToast {
  return {
    description: `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
    }).format()}`,
    ...options,
  }
}
