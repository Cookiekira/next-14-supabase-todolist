import { auth } from '@clerk/nextjs'

import { TodoAdd } from '@/components/TodoAdd'
import { TodoList } from '@/components/TodoList'
import { supabaseClient } from '@/supabase'

async function addTodo(taskText: string) {
  'use server'

  const userId = auth().userId
  if (!userId) throw new Error('User not authenticated')

  const token = (await auth().getToken({ template: 'supabase' })) || ''

  const task = taskText.trim()

  if (task.length) {
    const { error } = await supabaseClient(token)
      .from('todos')
      .insert([{ task, user_id: userId }])

    if (error) {
      console.log('error', error)
    }
  }
}

export default function TodoHome() {
  return (
    <main className='max-w-2xl min-h-[50vh] mx-auto flex flex-col items-center justify-center'>
      <h1 className='text-[4rem] font-bold w-full mb-8'>Todo List.</h1>
      <section className='w-full flex items-center gap-3 mb-4'>
        <TodoAdd addTodo={addTodo} />
      </section>
      <section className='w-full'>
        <TodoList />
      </section>
    </main>
  )
}
