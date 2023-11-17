import { Card, CardBody } from '@nextui-org/react'

import { getTodos } from '@/app/(main)/actions'

export async function TodoList() {
  const todos = await getTodos()

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
