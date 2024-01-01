import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function Header() {
  return (
    <header className='flex items-center justify-end p-4'>
      <div className='flex gap-4 items-center'>
        <ThemeSwitcher />
      </div>
    </header>
  )
}
