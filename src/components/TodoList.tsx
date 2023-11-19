'use client'
import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react'

import type { Database } from '@/supabase/todos.types'

type Todo = Database['public']['Tables']['todos']['Row']

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <>
      <Card
        radius='sm'
        isBlurred
        className='bg-background/60 dark:bg-default-100/50 max-h-[60vh] overflow-y-auto'
      >
        <CardBody>
          <Listbox
            items={todos}
            variant='shadow'
            itemClasses={{
              base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80',
            }}
          >
            {(item) => (
              <ListboxItem
                key={item.id}
                className='text-[1.25rem] font-bold'
                title={item.task}
              />
            )}
          </Listbox>
        </CardBody>
      </Card>
    </>
  )
}
