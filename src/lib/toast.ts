import type { ExternalToast } from 'sonner'

export function toastDefaultOptions(): ExternalToast {
  return {
    description: `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
    }).format()}`,
  }
}
