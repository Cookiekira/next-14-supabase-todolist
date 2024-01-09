'use client'

import { useTheme } from 'next-themes'
import React from 'react'
import { flushSync } from 'react-dom'

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

  const isDark = resolvedTheme === 'dark'

  React.useEffect(() => setMounted(true), [])

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark')
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    document
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .startViewTransition(() => {
        flushSync(() => {
          setTheme(isDark ? 'light' : 'dark')
        })
      })
      .ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 600,
            easing: 'ease-in',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
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
