import './globals.css'

import { auth, ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { supabaseClient, SupabaseClientContext } from '@/supabase'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todolist',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await auth().getToken({ template: 'supabase' })) || ''
  const supabase = supabaseClient(token)

  return (
    <html lang='en'>
      <ClerkProvider>
        <SupabaseClientContext.Provider value={supabase}>
          <body className={`${inter.className} text-foreground bg-background`}>
            {children}
          </body>
        </SupabaseClientContext.Provider>
      </ClerkProvider>
    </html>
  )
}
