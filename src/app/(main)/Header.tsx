import { cookies } from 'next/headers'

import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/supabase/server'

export async function Header() {
  const supabase = createClient(cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <header className='flex items-center justify-end p-4'>
      <div className='flex gap-4 items-center'>
        <ThemeSwitcher />
        <Avatar>
          <AvatarImage src={user!.user_metadata.avatar_url} />
        </Avatar>
      </div>
    </header>
  )
}
