'use server'

import { auth } from '@clerk/nextjs'

import { supabaseClient } from '@/supabase'

async function supabase() {
  const token = (await auth().getToken({ template: 'supabase' })) || ''
  const supabase = supabaseClient(token)
  return supabase
}

async function addTodo(taskText: string) {
  const userId = auth().userId
  if (!userId) throw new Error('User not authenticated')

  const task = taskText.trim()

  if (task.length) {
    const { error } = await (await supabase())
      .from('todos')
      .insert([{ task, user_id: userId }])

    if (error) {
      console.log('error', error)
    }
  }
}

async function getTodos() {
  const { data: todos, error } = await (await supabase())
    .from('todos')
    .select('*')
    .order('id', { ascending: true })

  if (error) console.log('error', error)

  return todos || []
}

export { addTodo, getTodos }
