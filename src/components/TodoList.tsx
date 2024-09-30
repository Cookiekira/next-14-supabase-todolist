'use client'
import clsx from 'clsx'
import { useIsClient } from 'foxact/use-is-client'
import { Reorder } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

import {
  addTodo,
  deleteTodo,
  getTodos,
  reorderTodos,
  toggleTodoCompleted,
} from '@/app/(main)/actions'
import { Confirm } from '@/assets'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toastDefaultOptions } from '@/lib/toast'
import type { Database } from '@/supabase/todos.types'

import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

export type Todo = Database['public']['Tables']['todos']['Row']

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const isClient = useIsClient()

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

  const handleReorderTodos = async (todos: Todo[]) => {
    const optimisticData = todos.map((todo, order) => ({
      ...todo,
      order,
    }))

    await mutateTodos(
      async () => {
        const res = await reorderTodos(optimisticData)
        return res.data ?? []
      },
      {
        optimisticData: optimisticData,
      }
    )
  }

  return (
    <>
      <div className='flex flex-col'>
        <section className='w-full flex flex-grow-0 items-center gap-3 mb-4'>
          <TodoAdd todos={todos} />
        </section>
        <section className='w-full flex-grow'>
          <Card>
            <ScrollArea className='h-full min-h-[20rem] max-h-[80vh] '>
              <CardContent className='space-y-5 pt-5'>
                <Reorder.Group
                  className='space-y-5'
                  axis='y'
                  values={todos}
                  onReorder={handleReorderTodos}
                >
                  {todos.map((todo) => (
                    <Reorder.Item key={todo.id} value={todo}>
                      <div className='flex items-center justify-between cursor-pointer '>
                        <div
                          className='space-y-1'
                          onClick={async () => {
                            await toggleTodo(todo.id)
                          }}
                        >
                          <p className='w-fit text-lg font-medium leading-none   relative'>
                            <span
                              className={clsx(
                                `after:content-[''] after:ml-[0.1em] after:top-1/2 after:left-0
                           after:absolute after:h-[0.2em] after:bg-black after:transition-all
                           after:ease-in-out after:duration-500
                          `,
                                todo.is_complete
                                  ? 'after:opacity-100  after:w-full italic'
                                  : 'after:opacity-0  after:w-0'
                              )}
                            >
                              {todo.task}
                            </span>
                          </p>

                          {isClient ? (
                            <p className='text-xs'>
                              {Intl.DateTimeFormat('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }).format(new Date(todo.updated_at))}
                            </p>
                          ) : (
                            <p className='text-xs'>Syncing...</p>
                          )}
                        </div>
                        <div className='flex gap-4 items-center'>
                          {todo.is_complete && (
                            <Confirm fontSize={20} color='#a3e635' />
                          )}

                          <Button
                            size='icon'
                            className='group bg-accent hover:bg-destructive '
                            onClick={async (e) => {
                              e.stopPropagation()
                              await handleDeleteTodo(todo.id)
                            }}
                          >
                            <span className='i-ph-x text-accent-foreground group-hover:text-destructive-foreground text-lg' />
                          </Button>
                        </div>
                      </div>
                      <Separator className='my-4' />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {todos.length === 0 && (
                  <h2 className='text-3xl font-semibold text-secondary-foreground h-full flex items-center justify-center'>
                    No todos yet
                  </h2>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </section>
      </div>
    </>
  )
}

function TodoAdd({ todos }: { todos: Todo[] }) {
  const [newTask, setNewTask] = useState('')

  const handleAddTodo = async () => {
    const task = newTask.trim()

    await mutate(
      'todos',
      async () => {
        if (!task) {
          toast.error('Task cannot be empty', toastDefaultOptions())
          return todos
        }

        setNewTask('')
        const { data: todo, error } = await addTodo(task)

        if (error) {
          toast.error(error.message, toastDefaultOptions())
          return todos
        }
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
        className='w-full h-10 '
        placeholder='What needs to be done?'
        autoFocus
        value={newTask}
        onChange={(e) => {
          setNewTask(e.target.value)
        }}
        onKeyUp={async (e) => {
          if (e.key === 'Enter') {
            await handleAddTodo()
          }
        }}
      />
      <Button size='lg' onClick={handleAddTodo}>
        Add
      </Button>
    </>
  )
}
