'use client'

import { refreshToken } from '@/supabase'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ComponentProps } from 'react'
import { SWRConfig } from 'swr'

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
