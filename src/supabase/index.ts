import { auth } from '@clerk/nextjs'
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

const MAX_CLIENT_SIZE = 10
const supabaseClientMap = new Map<string, ReturnType<typeof supabaseClient>>()
const clientQueue: string[] = []

async function supabase() {
  const token = (await auth().getToken({ template: 'supabase' })) ?? ''

  const userId = auth().userId ?? ''

  if (!supabaseClientMap.has(userId)) {
    clientQueue.push(userId)

    // If the cache size exceeds the maximum allowed, remove the oldest userId and its client
    if (supabaseClientMap.size > MAX_CLIENT_SIZE) {
      const oldestClient = clientQueue.shift()
      if (oldestClient) {
        supabaseClientMap.delete(oldestClient)
      }
    }
  }

  const newClient = supabaseClient(token)
  supabaseClientMap.set(userId, newClient)

  return supabaseClientMap.get(userId)!
}

export { supabase }
