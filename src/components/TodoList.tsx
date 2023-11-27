'use client'
import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'

import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodoCompleted,
} from '@/app/(main)/actions'
import { XSquare } from '@/assets/icons/XSquare'
import type { Database } from '@/supabase/todos.types'

type Todo = Database['public']['Tables']['todos']['Row']

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const { data: todos, mutate: mutateTodos } = useSWR(
    'todos',
    () => getTodos().then((res) => res.data ?? []),
    {
      fallbackData: initialTodos,
      revalidateOnMount: false,
    }
  )

  const [selectedTodoKeys, setSelectedTodokeys] = useState(
    new Set(
      todos.filter((todo) => todo.is_complete).map((todo) => todo.id.toString())
    )
  )

  const toggleTodo = async (id: number) => {
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
  }

  const handleDeleteTodo = async (id: number) => {
    const optimisticData = todos.filter((t) => t.id !== id)
    await mutateTodos(
      async () => {
        await deleteTodo(id)
        return optimisticData
      },
      {
        optimisticData: optimisticData,
        revalidate: false,
      }
    )
  }

  return (
    <>
      <section className='w-full flex items-center gap-3 mb-4'>
        <TodoAdd todos={todos} />
      </section>
      <section className='w-full'>
        <Card
          radius='sm'
          isBlurred
          className='bg-background/60 dark:bg-default-100/50 max-h-[60vh] overflow-y-auto'
        >
          <CardBody>
            <Listbox
              aria-label='Todo List'
              variant='shadow'
              itemClasses={{
                base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80',
              }}
              selectionMode='multiple'
              selectedKeys={selectedTodoKeys}
            >
              {todos.map((todo) => (
                <ListboxItem
                  key={todo.id}
                  aria-label={todo.task}
                  className='text-[1.25rem] font-bold'
                  onClick={async () => {
                    await toggleTodo(todo.id)
                  }}
                  endContent={
                    <XSquare
                      className='hover:text-red-500'
                      onClick={async (e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        await handleDeleteTodo(todo.id)
                      }}
                    />
                  }
                >
                  {todo.task}
                </ListboxItem>
              ))}
            </Listbox>
          </CardBody>
        </Card>
      </section>
    </>
  )
}

function TodoAdd({ todos }: { todos: Todo[] }) {
  const [newTask, setNewTask] = useState('')
  const [errorText, setErrorText] = useState('')

  const handleAddTodo = async () => {
    const task = newTask.trim()

    await mutate(
      'todos',
      async () => {
        if (!task) {
          setErrorText('Task cannot be empty')
          return todos
        }

        if (task.length <= 3) {
          setErrorText('Task must be longer than 3 characters')
          return todos
        }

        const { data: todo, error } = await addTodo(task)
        if (error) {
          setErrorText(error?.message ?? '')
          return todos
        }
        setErrorText('')
        setNewTask('')
        return [...todos, todo]
      },
      {
        optimisticData: [
          ...todos,
          {
            task: task,
            is_complete: false,
            id: crypto.randomUUID(),
          },
        ],
        revalidate: false,
      }
    )
  }

  return (
    <>
      <Input
        className='w-full'
        placeholder='What needs to be done?'
        radius='sm'
        size='sm'
        value={newTask}
        errorMessage={errorText}
        onChange={(e) => {
          setNewTask(e.target.value)
        }}
        onKeyUp={async (e) => {
          if (e.key === 'Enter') {
            await handleAddTodo()
          }
        }}
      />
      <Button radius='sm' size='lg' onClick={handleAddTodo}>
        Add
      </Button>
    </>
  )
}
