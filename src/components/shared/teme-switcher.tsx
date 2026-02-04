'use client'

import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import type { JSX } from 'react'
import { useSyncExternalStore, useRef, useState } from 'react'
import { ThemeToggleButton } from '@/components/shared/theme-toggler-button'
import { cn } from '@/lib/utils'

function ThemeOption({
   icon,
   value,
   isActive,
   onClick
}: {
   icon: JSX.Element
   value: string
   isActive?: boolean
   onClick: (value: string) => void
}) {
   return (
      <button
         className={cn(
            'relative flex size-8 cursor-default items-center justify-center rounded-full transition-[color] [&_svg]:size-4',
            isActive
               ? 'text-zinc-950 dark:text-zinc-50'
               : 'text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50'
         )}
         role='radio'
         aria-checked={isActive}
         aria-label={`Switch to ${value} theme`}
         onClick={() => onClick(value)}
         type='button'
      >
         {icon}
         {isActive && (
            <motion.div
               layoutId='theme-option'
               transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
               className='absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700'
            />
         )}
      </button>
   )
}

const THEME_OPTIONS = [
   /*{
      icon: <MonitorIcon />,
      value: 'system'
   },*/
   {
      icon: <SunIcon />,
      value: 'light'
   },
   {
      icon: <MoonStarIcon />,
      value: 'dark'
   }
]

function ThemeSwitcher() {
   const { theme, setTheme } = useTheme()
   const [variant, setVariant] = useState(
      randomVariant())
   const toggleButtonRef = useRef<HTMLButtonElement>(null)

   const isMounted = useSyncExternalStore(
      () => () => {},
      () => true,
      () => false
   )

   const handleThemeOptionClick = (value: string) => {
      // Trigger the hidden ThemeToggleButton instead of setTheme directly
      if (toggleButtonRef.current) {
         // Simulate click on hidden toggle button
         toggleButtonRef.current.click()
         setVariant(randomVariant())
      }
   }

   if (!isMounted) {
      return <div className='flex h-8 w-24' />
   }

   return (
      <div className='inline-flex items-center gap-1'>
         {/* Visible animated switcher - handles visual feedback only */}
         <motion.div
            key={String(isMounted)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700'
            role='radiogroup'
         >
            {THEME_OPTIONS.map(option => (
               <ThemeOption
                  key={option.value}
                  icon={option.icon}
                  value={option.value}
                  isActive={theme === option.value}
                  onClick={handleThemeOptionClick}
               />
            ))}
         </motion.div>

         {/* Hidden ThemeToggleButton that actually controls the theme */}
         <ThemeToggleButton
            ref={toggleButtonRef}
            className='hidden' // Screen reader only - completely hidden visually
            aria-hidden='true'
            variant={variant}
         />
      </div>
   )
}

export { ThemeSwitcher }

function randomVariant() {
   const randomNum = Math.floor(Math.random() * 4) + 1
   if (randomNum === 1) {
      return 'circle-blur'
   }
   if (randomNum === 2) {
      return 'polygon'
   }
   if (randomNum === 3) {
      return 'rectangle'
   }
   if (randomNum === 4) {
      return 'circle'
   }
}
