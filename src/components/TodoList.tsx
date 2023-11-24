'use client'
import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'
import { Button, Input } from '@nextui-org/react'
import { startTransition, useOptimistic, useState } from 'react'

import { deleteTodo, toggleTodoCompleted } from '@/app/(main)/actions'
import { addTodo } from '@/app/(main)/actions'
import { XSquare } from '@/assets/icons/XSquare'
import type { Database } from '@/supabase/todos.types'

type Todo = Database['public']['Tables']['todos']['Row']
type TodoAction =
  | {
      type: 'add'
      task: string
    }
  | {
      type: 'delete'
      id: number
    }
  | {
      type: 'toggle'
      id: number
    }

const optimisticTodosReducer = (state: Todo[], action: TodoAction) => {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          id: state.length + 1,
          task: action.task,
          is_complete: false,
          inserted_at: new Date().toISOString(),
          user_id: '1',
        },
      ]
    case 'delete':
      return state.filter((todo) => todo.id !== action.id)
    default:
      return state
  }
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos)
  const setAddTodo = (todo: Todo) => {
    setTodos((prev) => [...prev, todo])
  }

  const [optimisticTodos, dispatchOptimisticTodos] = useOptimistic(
    todos,
    optimisticTodosReducer
  )

  const [selectedTodoKeys, setSelectedTodokeys] = useState(
    new Set(
      optimisticTodos
        .filter((todo) => todo.is_complete)
        .map((todo) => todo.id.toString())
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

  return (
    <>
      <section className='w-full flex items-center gap-3 mb-4'>
        <TodoAdd
          setAddTodo={setAddTodo}
          dispatchOptimisticTodos={dispatchOptimisticTodos}
        />
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
              items={optimisticTodos}
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
                  onClick={async () => {
                    await toggleTodo(todo.id)
                  }}
                  endContent={
                    <XSquare
                      className='hover:text-red-500'
                      onClick={async (e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        dispatchOptimisticTodos({
                          type: 'delete',
                          id: todo.id,
                        })
                        await deleteTodo(todo.id)
                        setTodos((prev) => prev.filter((t) => t.id !== todo.id))
                      }}
                    />
                  }
                >
                  {todo.task}
                </ListboxItem>
              )}
            </Listbox>
          </CardBody>
          {todos.map((todo) => (
            <p key={todo.id}>{todo.task}</p>
          ))}
          {optimisticTodos.map((todo) => (
            <p key={todo.id}>{todo.task}</p>
          ))}
        </Card>
      </section>
    </>
  )
}

function TodoAdd({
  setAddTodo,
  dispatchOptimisticTodos,
}: {
  setAddTodo: (todo: Todo) => void
  dispatchOptimisticTodos: (action: TodoAction) => void
}) {
  const [newTask, setNewTask] = useState('')

  const handleAddTodo = async () => {
    startTransition(() => {
      dispatchOptimisticTodos({ type: 'add', task: newTask })
      setNewTask('')
    })

    const todo = await addTodo(newTask)
    console.log(todo)
    setAddTodo(todo!)
  }

  return (
    <>
      <Input
        className='w-full'
        placeholder='What needs to be done?'
        radius='sm'
        size='sm'
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
      <Button radius='sm' size='lg' onClick={handleAddTodo}>
        Add
      </Button>
    </>
  )
}
