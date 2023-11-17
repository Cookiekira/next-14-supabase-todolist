'use client'

import { Button, Input } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type TodoAddProps = {
  addTodo: (taskText: string) => Promise<void>
}

export function TodoAdd({ addTodo }: TodoAddProps) {
  const [newTask, setNewTask] = useState('')
  const router = useRouter()

  return (
    <>
      <Input
        className='w-full'
        placeholder='What needs to be done?'
        radius='sm'
        size='sm'
        onChange={(e) => {
          setNewTask(e.target.value)
        }}
      />
      <Button
        radius='sm'
        size='lg'
        onClick={async () => {
          await addTodo(newTask)
          router.refresh()
        }}
      >
        Add
      </Button>
    </>
  )
}
