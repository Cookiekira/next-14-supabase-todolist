import { auth } from '@clerk/nextjs'
import {
  createClient,
  type PostgrestSingleResponse,
} from '@supabase/supabase-js'

import type { Database } from '@/supabase/todos.types'

// Create a single supabase client for interacting with your database

const supabaseClient = (token: string) => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
    }
  )

  return supabase
}

const MAX_CLIENT_SIZE = 20
const supabaseClientMap = new Map<string, ReturnType<typeof supabaseClient>>()
const clientQueue: string[] = []

async function supabase() {
  const userId = auth().userId
  if (!userId) throw new Error('User not authenticated')

  if (!supabaseClientMap.has(userId)) {
    clientQueue.push(userId)

    const token = await auth().getToken({ template: 'supabase' })
    if (!token) throw new Error('No token found')

    const newClient = supabaseClient(token)
    supabaseClientMap.set(userId, newClient)

    // If the cache size exceeds the maximum allowed, remove the oldest userId and its client
    if (supabaseClientMap.size > MAX_CLIENT_SIZE) {
      const oldestClient = clientQueue.shift()
      if (oldestClient) {
        supabaseClientMap.delete(oldestClient)
      }
    }
  }

  return supabaseClientMap.get(userId)!
}

async function refreshToken() {
  const userId = auth().userId
  if (!userId) throw new Error('User not authenticated')

  const token = await auth().getToken({ template: 'supabase' })
  if (!token) throw new Error('No token found')

  const newClient = supabaseClient(token)
  supabaseClientMap.set(userId, newClient)
}

// //Create a wrapper around a supabase action that will refresh the token if it's expired
// ! This is a wrong pattern, don't use it in Server Actions
function createAction<Data, Params extends unknown[]>(
  fn: (...args: Params) => Promise<PostgrestSingleResponse<Data>>
) {
  return async (...args: Params) => {
    const res = await fn(...args)

    if (res.status === 401) {
      await refreshToken()
      return await fn(...args)
    }

    return res
  }
}

export { createAction, refreshToken, supabase }
