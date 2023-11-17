import { TodoAdd } from '@/components/TodoAdd'
import { TodoList } from '@/components/TodoList'

export default function TodoHome() {
  return (
    <main className='max-w-2xl min-h-[50vh] mx-auto flex flex-col items-center justify-center'>
      <h1 className='text-[4rem] font-bold w-full mb-8'>Todo List.</h1>
      <section className='w-full flex items-center gap-3 mb-4'>
        <TodoAdd />
      </section>
      <section className='w-full'>
        <TodoList />
      </section>
    </main>
  )
}
