import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todolist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <ClerkProvider>
        <body className={`${inter.className} text-foreground bg-background`}>
          {children}
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  )
}
