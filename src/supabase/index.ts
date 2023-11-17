import { createClient } from '@supabase/supabase-js'
import { createContext } from 'react'

import type { Database } from '@/supabase/todos.types'

// Create a single supabase client for interacting with your database

const supabaseClient = (token: string) => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_KEY || '',
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
    }
  )

  return supabase
}

const SupabaseClientContext = createContext<ReturnType<
  typeof createClient<Database>
> | null>(null)

export { supabaseClient, SupabaseClientContext }
