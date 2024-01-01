'use client'

import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { createClient } from '@/supabase/client'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function UserAvatar({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter()
  const sighOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Sighed out successfully')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.user_metadata.avatar_url} />
          <AvatarFallback className='border bg-secondary text-secondary-foreground'>
            {user?.email?.[0] ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onSelect={sighOut}>
          Sigh Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
