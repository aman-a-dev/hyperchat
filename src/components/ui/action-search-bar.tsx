'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { Search } from 'lucide-react'
import useDebounce from '@/hooks/use-debounce'

interface User {
   id: string
   name: string
   email: string
   avatar?: string
}

interface ChatSearchBarProps {
   users?: User[]
   triggerIcon?: React.ReactNode
   onOpen?: () => void // <-- callback when search opens
}

const sampleUsers: User[] = [
   {
      id: '1',
      name: 'Aman Tadesse',
      email: 'aman@example.com',
      avatar: 'https://i.pravatar.cc/40?img=1'
   },
   {
      id: '2',
      name: 'Selam Alemu',
      email: 'selam@example.com',
      avatar: 'https://i.pravatar.cc/40?img=2'
   },
   {
      id: '3',
      name: 'Mulugeta Abebe',
      email: 'mulugeta@example.com',
      avatar: 'https://i.pravatar.cc/40?img=3'
   },
   {
      id: '4',
      name: 'Sara Desta',
      email: 'sara@example.com',
      avatar: 'https://i.pravatar.cc/40?img=4'
   }
]

const ANIMATION_VARIANTS = {
   container: {
      hidden: { opacity: 0, y: -20 },
      show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
   },
   item: {
      hidden: { opacity: 0, x: -20 },
      show: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20, transition: { duration: 0.15 } }
   }
} as const

export default function ChatSearchBar({
   users = sampleUsers,
   onOpen
}: ChatSearchBarProps) {
   const [query, setQuery] = useState('')
   const [isOpen, setIsOpen] = useState(false)
   const [selectedUser, setSelectedUser] = useState<User | null>(null)
   const [activeIndex, setActiveIndex] = useState(-1)

   const debouncedQuery = useDebounce(query, 200)

   const filteredUsers = useMemo(() => {
      const q = debouncedQuery.toLowerCase().trim()
      if (!q) return users // <-- always return all users if search is empty

      return users.filter(
         u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
      )
   }, [debouncedQuery, users])

   const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
         setQuery(e.target.value)
         setActiveIndex(-1)
      },
      []
   )

   const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (!filteredUsers.length) return
         switch (e.key) {
            case 'ArrowDown':
               e.preventDefault()
               setActiveIndex(prev =>
                  prev < filteredUsers.length - 1 ? prev + 1 : 0
               )
               break
            case 'ArrowUp':
               e.preventDefault()
               setActiveIndex(prev =>
                  prev > 0 ? prev - 1 : filteredUsers.length - 1
               )
               break
            case 'Enter':
               e.preventDefault()
               if (activeIndex >= 0 && filteredUsers[activeIndex]) {
                  setSelectedUser(filteredUsers[activeIndex])
                  setIsOpen(false)
               }
               break
            case 'Escape':
               setIsOpen(false)
               break
         }
      },
      [filteredUsers, activeIndex]
   )

   const handleUserClick = (user: User) => {
      setSelectedUser(user)
      setIsOpen(false)
   }

   return (
      <>
         {/* Trigger Button */}
         <Search
            onClick={() => {
               setIsOpen(true)
               if (onOpen) onOpen() // <-- call parent callback
            }}
         />
         {/* Overlay */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  className='fixed inset-0 bg-background/40 backdrop-blur-lg z-40 flex items-start justify-center pt-10 px-3 h-screen'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
               >
                  <motion.div
                     className='w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg p-4 z-50'
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     onClick={e => e.stopPropagation()}
                  >
                     <Input
                        placeholder='Search users...'
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className='mb-3'
                     />
                     <span className='text-muted-foreground text-xs'>
                        Search by name or email
                     </span>

                     <motion.div
                        variants={ANIMATION_VARIANTS.container}
                        initial='hidden'
                        animate='show'
                        exit='exit'
                     >
                        {filteredUsers.length === 0 && query.length > 0 && (
                           <p className='text-md text-muted-foreground py-2'>
                              No users found
                           </p>
                        )}

                        {filteredUsers.map((user, idx) => (
                           <motion.div
                              key={user.id}
                              variants={ANIMATION_VARIANTS.item}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                 activeIndex === idx
                                    ? 'bg-gray-100 dark:bg-gray-800'
                                    : ''
                              }`}
                              onClick={() => handleUserClick(user)}
                           >
                              <div className='flex items-center gap-3'>
                                 <Avatar>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                       {user.name[0]}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                                       {user.name}
                                    </p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                       {user.email}
                                    </p>
                                 </div>
                              </div>
                              <Button
                                 size='sm'
                                 variant='outline'
                              >
                                 Chat
                              </Button>
                           </motion.div>
                        ))}
                     </motion.div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   )
}
