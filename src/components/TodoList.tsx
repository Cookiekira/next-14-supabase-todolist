'use client'
import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { deleteTodo, toggleTodoCompleted } from '@/app/(main)/actions'
import { XSquare } from '@/assets/icons/XSquare'
import type { Database } from '@/supabase/todos.types'

type Todo = Database['public']['Tables']['todos']['Row']

export function TodoList({ todos }: { todos: Todo[] }) {
  const router = useRouter()

  const [selectedTodoKeys, setSelectedTodokeys] = useState(
    new Set(
      todos.filter((todo) => todo.is_complete).map((todo) => todo.id.toString())
    )
  )

  const toggleTodo = useCallback(async (id: number) => {
    let is_complete = false

    setSelectedTodokeys((prev) => {
      is_complete = prev.has(id.toString())
      const newSet = new Set(prev)
      if (is_complete) {
        newSet.delete(id.toString())
      } else {
        newSet.add(id.toString())
      }
      return newSet
    })

    await toggleTodoCompleted(id, is_complete)
  }, [])

  return (
    <>
      <Card
        radius='sm'
        isBlurred
        className='bg-background/60 dark:bg-default-100/50 max-h-[60vh] overflow-y-auto'
      >
        <CardBody>
          <Listbox
            aria-label='Todo List'
            items={todos}
            variant='shadow'
            itemClasses={{
              base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80',
            }}
            selectionMode='multiple'
            selectedKeys={selectedTodoKeys}
          >
            {(todo) => (
              <ListboxItem
                key={todo.id}
                aria-label={todo.task}
                className='text-[1.25rem] font-bold'
                title={todo.task}
                onClick={async (e) => {
                  e.preventDefault()
                  await toggleTodo(todo.id)
                }}
                endContent={
                  <XSquare
                    className='hover:text-red-500'
                    onClick={async (e) => {
                      e.stopPropagation()
                      await deleteTodo(todo.id)
                      router.refresh()
                    }}
                  />
                }
              />
            )}
          </Listbox>
        </CardBody>
      </Card>
    </>
  )
}
