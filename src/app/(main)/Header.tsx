import { UserButton } from '@clerk/nextjs'

import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function Header() {
  return (
    <header className='flex items-center justify-between p-4'>
      <h1 className='text-2xl font-bold'>Todolist</h1>

      <div className='flex gap-4 items-center'>
        <ThemeSwitcher />

        <UserButton
          afterSignOutUrl='/'
          userProfileMode='modal'
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10 ring-5 ring-white/20',
            },
          }}
        />
      </div>
    </header>
  )
}
