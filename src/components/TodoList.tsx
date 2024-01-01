'use client'
import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import { Button, Input } from '@nextui-org/react'
import { useMemo, useState } from 'react'
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
    async () => {
      const res = await getTodos()
      if (res.error) {
        throw Error(res.error.message)
      }
      return res.data
    },
    {
      fallbackData: initialTodos,
    }
  )

  const selectedTodoKeys = useMemo(
    () =>
      new Set(
        todos
          .filter((todo) => todo.is_complete)
          .map((todo) => todo.id.toString())
      ),
    [todos]
  )

  const toggleTodo = async (id: number) => {
    await mutateTodos(
      async () => {
        let is_complete = false
        const res = todos.map((todo) => {
          if (todo.id === id) {
            is_complete = todo.is_complete
            return {
              ...todo,
              is_complete: !is_complete,
            }
          }
          return todo
        })
        await toggleTodoCompleted(id, !is_complete)
        return res
      },
      {
        optimisticData(_currentData, displayedData) {
          if (!displayedData) return []
          return displayedData.map((todo) => {
            if (todo.id === id) {
              return {
                ...todo,
                is_complete: !todo.is_complete,
              }
            }
            return todo
          })
        },
      }
    )
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
                  description={Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(todo.updated_at))}
                >
                  {todo.is_complete ? (
                    <i>
                      <del>{todo.task}</del>
                    </i>
                  ) : (
                    <span>{todo.task}</span>
                  )}
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

        setNewTask('')
        const { data: todo, error } = await addTodo(task)

        if (error) {
          setErrorText(error.message)
          return todos
        }
        setErrorText('')
        return [...todos, todo]
      },
      {
        optimisticData: [
          ...todos,
          {
            task: task,
            is_complete: false,
            id: crypto.randomUUID(),
            updated_at: new Date().toISOString(),
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
