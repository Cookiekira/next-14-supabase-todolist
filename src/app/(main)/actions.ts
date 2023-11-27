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

  if (res.error) console.log('error', res.error)

  return res
}

async function getTodos() {
  const res = await (await supabase())
    .from('todos')
    .select('*')
    .order('id', { ascending: true })

  if (res.error) throw new Error('Error fetching todos')

  return res
}

async function toggleTodoCompleted(id: number, is_complete: boolean) {
  const res = await (await supabase())
    .from('todos')
    .update({ is_complete: !is_complete, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single()

  if (res.error) console.log('error', res.error)

  return res
}

async function deleteTodo(id: number) {
  // delete todo with id and return all todos
  const res = await (await supabase())
    .from('todos')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (res.error) console.log('error', res.error)

  return res
}

export { addTodo, deleteTodo, getTodos, toggleTodoCompleted }
