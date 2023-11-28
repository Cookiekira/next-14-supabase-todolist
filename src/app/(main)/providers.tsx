'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'
import { SWRConfig } from 'swr'

import { refreshToken } from '@/supabase'

export function Providers({ children }: { children: React.ReactNode }) {
  const options: ComponentProps<typeof SWRConfig>['value'] = {
    onError: async (err) => {
      if (err instanceof Error && err.message === 'JWT expired') {
        await refreshToken()
      }
    },
  }

  return (
    <NextUIProvider>
      <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
        <SWRConfig value={options}>{children}</SWRConfig>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
