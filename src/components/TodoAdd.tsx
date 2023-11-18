'use client'

import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { addTodo } from '@/app/(main)/actions'

export function TodoAdd() {
  const [newTask, setNewTask] = useState('')
  const router = useRouter()

  const handleAddTodo = useCallback(async () => {
    await addTodo(newTask)
    setNewTask('')
    router.refresh()
  }, [newTask, router])

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
      <Button
        radius='sm'
        size='lg'
        onClick={async () => {
          await handleAddTodo()
        }}
      >
        Add
      </Button>
    </>
  )
}
