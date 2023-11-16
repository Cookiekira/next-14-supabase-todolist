import { Button, Input } from '@nextui-org/react'

export default function TodoHome() {
  return (
    <main className='max-w-2xl min-h-[50vh] mx-auto flex flex-col items-center justify-center'>
      <h1 className='text-[4rem] font-bold w-full mb-8'>Todo List.</h1>
      <div className='w-full flex items-center gap-3'>
        <Input
          className='w-full'
          placeholder='What needs to be done?'
          radius='sm'
          size='sm'
        />
        <Button radius='sm' size='lg'>
          Add
        </Button>
      </div>
    </main>
  )
}
