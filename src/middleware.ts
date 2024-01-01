import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Clear cookies on 500 error
  const cookieStore = cookies()
  if (response.status === 500) {
    cookieStore.getAll().forEach((cookie) => {
      cookieStore.delete(cookie.name)
    })

    return NextResponse.redirect(new URL('/login'))
  }

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
