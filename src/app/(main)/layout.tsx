import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'

import { Header } from './Header'

export default async function TodoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient(cookies())
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <Header />
      {children}
    </>
  )
}
