'use server'

import { auth } from '@clerk/nextjs'

import { supabase } from '@/supabase'

async function addTodo(taskText: string) {
  const userId = auth().userId
  if (!userId) throw new Error('User not authenticated')

  const task = taskText.trim()

  const { error } = await (await supabase())
    .from('todos')
    .insert([{ task, user_id: userId }])

  if (error) {
    console.log('error', error)
  }
  return error
}

async function getTodos() {
  const { data: todos, error } = await (await supabase())
    .from('todos')
    .select('*')
    .order('id', { ascending: true })

  if (error) console.log('error', error)

  return todos || []
}

async function toggleTodoCompleted(id: number, is_complete: boolean) {
  const { error } = await (await supabase())
    .from('todos')
    .update({ is_complete: !is_complete, updated_at: new Date() })
    .eq('id', id)

  if (error) console.log('error', error)

  return error
}

async function deleteTodo(id: number) {
  const { error } = await (await supabase()).from('todos').delete().eq('id', id)

  if (error) console.log('error', error)

  return error
}

export { addTodo, deleteTodo, getTodos, toggleTodoCompleted }
