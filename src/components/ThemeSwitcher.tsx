'use client'

import { useTheme } from 'next-themes'
import React from 'react'

import { Gear, Moon, Sun } from '@/assets'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const themes = [
  {
    label: 'Light',
    value: 'light',
    icon: Sun,
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: Moon,
  },
]
export function ThemeSwitcher() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, theme, resolvedTheme } = useTheme()
  const ThemeIcon = React.useMemo(
    () => themes.find((t) => t.value === theme)?.icon ?? Gear,
    [theme]
  )

  React.useEffect(() => setMounted(true), [])

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          type='button'
          aria-label='切换颜色主题'
          className='group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20'
          onClick={toggleTheme}
        >
          <ThemeIcon className='h-6 w-6 text-15 stroke-zinc-500 p-0.5 transition group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-200' />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {themes.find((t) => t.value == theme)?.label || 'System'}
      </TooltipContent>
    </Tooltip>
  )
}
