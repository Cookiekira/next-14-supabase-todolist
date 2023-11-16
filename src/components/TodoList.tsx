import { Card, CardBody } from '@nextui-org/react'

import { supabase } from '@/supabase'

export function TodoList() {
  const todos = supabase.from('todos').select('*')

  return (
    <>
      <Card
        radius='sm'
        isBlurred
        className='bg-background/60 dark:bg-default-100/50'
      >
        <CardBody>
          <p>Todo List</p>
        </CardBody>
      </Card>
    </>
  )
}
