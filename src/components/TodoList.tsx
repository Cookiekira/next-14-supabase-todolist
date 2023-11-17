import { Card, CardBody } from '@nextui-org/react'

import { supabase } from '@/supabase'

async function getTodos() {
  'use server'

  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .order('id', { ascending: true })

  if (error) console.log('error', error)

  return todos || []
}

export async function TodoList() {
  const todos = await getTodos()

  console.log(todos)

  return (
    <>
      <Card
        radius='sm'
        isBlurred
        className='bg-background/60 dark:bg-default-100/50'
      >
        <CardBody>
          <p>Todo List</p>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.task}</li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </>
  )
}
