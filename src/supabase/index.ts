import { createClient } from '@supabase/supabase-js'

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

export { supabaseClient }
