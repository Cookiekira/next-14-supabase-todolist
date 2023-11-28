'use server'

import { auth } from '@clerk/nextjs'

import { supabase } from '@/supabase'

async function addTodo(taskText: string) {
  const userId = auth().userId
  if (!userId) throw new Error('User not authenticated')

  const task = taskText.trim()

  const res = await (
    await supabase()
  )
    .from('todos')
    .insert([{ task, user_id: userId }])
    .select()
    .single()

  return res
}

async function getTodos() {
  const res = await (await supabase())
    .from('todos')
    .select('*')
    .order('id', { ascending: true })

  return res
}

async function toggleTodoCompleted(id: number, is_complete: boolean) {
  const res = await (await supabase())
    .from('todos')
    .update({ is_complete, updated_at: new Date().toISOString() })
    .eq('id', id)

  return res
}

async function deleteTodo(id: number) {
  const res = await (await supabase()).from('todos').delete().eq('id', id)

  return res
}

export { addTodo, deleteTodo, getTodos, toggleTodoCompleted }
