import { TodoList } from '@/components/TodoList'

import { getTodos } from './actions'

export default async function TodoHome() {
  const initialTodos = await getTodos()

  return (
    <main className='max-w-2xl min-h-[50vh] mx-auto flex flex-col items-center justify-center'>
      <h1 className='text-[4rem] font-bold w-full mb-8'>Todo List.</h1>

      <TodoList initialTodos={initialTodos} />
    </main>
  )
}
