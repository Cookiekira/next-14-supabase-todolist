'use server'

import { cookies } from 'next/headers'

import type { Todo } from '@/components/TodoList'
import { createClient } from '@/supabase/server'

async function addTodo(taskText: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const task = taskText.trim()
  const userId = (await supabase.auth.getSession()).data.session?.user.id
  if (!userId) throw new Error('User is not logged in')

  const res = await supabase
    .from('todos')
    .insert([{ task, user_id: userId }])
    .select()
    .single()

  return res
}

async function getTodos() {
  const supabase = createClient(cookies())

  const res = await supabase
    .from('todos')
    .select('*')
    .order('order', { ascending: true })

  return res
}

async function toggleTodoCompleted(id: number, is_complete: boolean) {
  const supabase = createClient(cookies())

  const res = await supabase
    .from('todos')
    .update({ is_complete, updated_at: new Date().toISOString() })
    .eq('id', id)

  return res
}

async function deleteTodo(id: number) {
  const supabase = createClient(cookies())

  const res = await supabase.from('todos').delete().eq('id', id)

  return res
}

async function reorderTodos(todos: Todo[]) {
  const supabase = createClient(cookies())

  const res = await supabase
    .from('todos')
    .upsert(todos, { onConflict: 'id' })
    .select()

  return res
}

export { addTodo, deleteTodo, getTodos, reorderTodos, toggleTodoCompleted }
