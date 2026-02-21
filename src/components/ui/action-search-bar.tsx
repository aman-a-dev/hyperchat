'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'motion/react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import useDebounce from '@/hooks/use-debounce'

interface User {
   id: string
   name: string
   email: string
   avatar?: string | null
}

interface ChatSearchBarProps {
   query: string
   setQuery: React.Dispatch<React.SetStateAction<string>>
   onOpen?: () => void
}

const ANIMATION = {
   container: {
      hidden: { opacity: 0, y: -10 },
      show: { opacity: 1, y: 0 }
   },
   item: {
      hidden: { opacity: 0, x: -10 },
      show: { opacity: 1, x: 0 }
   }
}

export default function ChatSearchBar({
   query,
   setQuery,
   onOpen
}: ChatSearchBarProps) {
   const [isOpen, setIsOpen] = useState(false)
   const [users, setUsers] = useState<User[]>([
      {
         id: 'hvxeZrgc35gvcg',
         name: 'Amanuel Antenh',
         email: 'amanuelantenha@gmail.com'
      }
   ])
   const [loading, setLoading] = useState(false)
   const [activeIndex, setActiveIndex] = useState(-1)

   const debouncedQuery = useDebounce(query, 300)

   // 🔥 Fetch users from DB
   useEffect(() => {
      if (!debouncedQuery) {
         setUsers([])
         return
      }

      const fetchUsers = async () => {
         try {
            setLoading(true)
            const res = await fetch(`/api/users/search?q=${debouncedQuery}`)
            const data = await res.json()
            setUsers(prev => [...prev,data])
         } catch (err) {
            console.error(err)
         } finally {
            setLoading(false)
         }
      }

      fetchUsers()
   }, [debouncedQuery])

   // ⌨️ Keyboard navigation
   const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (!users.length) return

         if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => (i + 1) % users.length)
         }

         if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => (i - 1 + users.length) % users.length)
         }

         if (e.key === 'Enter' && users[activeIndex]) {
            setIsOpen(false)
         }

         if (e.key === 'Escape') {
            setIsOpen(false)
         }
      },
      [users, activeIndex]
   )

   // 🧼 Reset on close
   useEffect(() => {
      if (!isOpen) {
         setQuery('')
         setUsers([])
         setActiveIndex(-1)
      }
   }, [isOpen, setQuery])

   return (
      <>
         {/* Trigger */}
         <Search
            className='cursor-pointer'
            onClick={() => {
               setIsOpen(true)
               onOpen?.()
            }}
         />

         <AnimatePresence>
            {isOpen && (
               <motion.div
                  className='fixed inset-0 z-40 flex justify-center pt-10 px-3'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
               >
                  <motion.div
                     className='w-full max-w-md rounded-xl p-4 shadow-lg'
                     variants={ANIMATION.container}
                     initial='hidden'
                     animate='show'
                     exit='hidden'
                     onClick={e => e.stopPropagation()}
                  >
                     <Input
                        autoFocus
                        placeholder='Search users...'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='mb-2 bg-background'
                     />

                     <div className='text-xs text-muted-foreground mb-2'>
                        Search by name or email
                     </div>

                     {loading && (
                        <p className='text-sm text-muted-foreground'>
                           Searching...
                        </p>
                     )}

                     {!query && (
                        <p className='text-sm text-muted-foreground'>
                           Start typing to search
                        </p>
                     )}

                     {!loading && query && users.length === 0 && (
                        <p className='text-sm text-muted-foreground'>
                           No users found
                        </p>
                     )}

                     <motion.div>
                        {users.map((user, idx) => (
                           <Link
                              key={user.id}
                              href={`/${user.email.split('@')[0]}`}
                           >
                              <motion.div
                                 variants={ANIMATION.item}
                                 className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                                    idx === activeIndex
                                       ? 'bg-muted'
                                       : 'hover:bg-muted'
                                 }`}
                                 onClick={() => setIsOpen(false)}
                              >
                                 <div className='flex items-center gap-3'>
                                    <Avatar>
                                       <AvatarImage src={user.avatar ?? ''} />
                                       <AvatarFallback>
                                          {user.name[0]}
                                       </AvatarFallback>
                                    </Avatar>
                                    <div>
                                       <p className='text-sm font-medium'>
                                          {user.name}
                                       </p>
                                       <p className='text-xs text-muted-foreground'>
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
                           </Link>
                        ))}
                     </motion.div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   )
}
