'use client'

import { useState, useCallback } from 'react'
import { SmoothTab } from '@/components/ui/smooth-tab'
import UserItem from './user-item'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Share2, Trash2, X, List, Folders } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner' // Optional: for notifications
import Link from 'next/link'
import { Logo } from '@/components/icon/icons'
import {
   Empty,
   EmptyContent,
   EmptyDescription,
   EmptyHeader,
   EmptyMedia,
   EmptyTitle
} from '@/components/ui/empty'
// Mock Data (Replace with your actual data source)
export const contacts = [
   {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      src: '/avatar1.png',
      online: true,
      link: '/chats/1',
      lastMsg: 'Bye baby'
   },
   {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      src: '/avatar2.png',
      online: false,
      link: '/chats/2'
   },
   {
      id: '3',
      name: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      src: '/avatar3.png',
      online: true,
      link: '/chats/3',
      lastMsg: 'good night 🌙 😴 ✨️ '
   },
   {
      id: '4',
      name: 'Diana Evans',
      email: 'diana.evans@example.com',
      src: '/avatar.png',
      online: false,
      link: '/chats/4'
   },
   {
      id: '5',
      name: 'Ethan Brown',
      email: 'ethan.brown@example.com',
      src: '/avatar5.png',
      online: true,
      link: '/chats/5'
   },
   {
      id: '6',
      name: 'Fatima Noor',
      email: 'fatima.noor@example.com',
      src: '/avatar6.png',
      online: true,
      link: '/chats/6'
   },
   {
      id: '7',
      name: 'George Miller',
      email: 'george.miller@example.com',
      src: '/avatar7.png',
      online: false,
      link: '/chats/7'
   },
   {
      id: '8',
      name: 'Hannah Lee',
      email: 'hannah.lee@example.com',
      src: '/avatar8.png',
      online: true,
      link: '/chats/8'
   },
   {
      id: '9',
      name: 'Isaac Kim',
      email: 'isaac.kim@example.com',
      src: '/avatar9.png',
      online: false,
      link: '/chats/9'
   },
   {
      id: '10',
      name: 'Julia Roberts',
      email: 'julia.roberts@example.com',
      src: '/avatar.png',
      online: true,
      link: '/chats/10'
   },

   {
      id: '11',
      name: 'Kevin Parker',
      email: 'kevin.parker@example.com',
      src: '/avatar11.png',
      online: false,
      link: '/chats/11'
   },
   {
      id: '12',
      name: 'Lina Ahmed',
      email: 'lina.ahmed@example.com',
      src: '/avatar12.png',
      online: true,
      link: '/chats/12'
   },
   {
      id: '13',
      name: 'Michael Scott',
      email: 'michael.scott@example.com',
      src: '/avatar13.png',
      online: false,
      link: '/chats/13'
   },
   {
      id: '14',
      name: 'Nina Patel',
      email: 'nina.patel@example.com',
      src: '/avatar14.png',
      online: true,
      link: '/chats/14'
   },
   {
      id: '15',
      name: 'Oscar White',
      email: 'oscar.white@example.com',
      src: '/avatar15.png',
      online: false,
      link: '/chats/15'
   },
   {
      id: '16',
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      src: '/avatar16.png',
      online: true,
      link: '/chats/16'
   },
   {
      id: '17',
      name: 'Quentin Moore',
      email: 'quentin.moore@example.com',
      src: '/avatar17.png',
      online: false,
      link: '/chats/17'
   },
   {
      id: '18',
      name: 'Rania Khalid',
      email: 'rania.khalid@example.com',
      src: '/avatar18.png',
      online: true,
      link: '/chats/18'
   },
   {
      id: '19',
      name: 'Samuel Green',
      email: 'samuel.green@example.com',
      src: '/avatar.png',
      online: false,
      link: '/chats/19'
   },
   {
      id: '20',
      name: 'Tina Lopez',
      email: 'tina.lopez@example.com',
      src: '/avatar20.png',
      online: true,
      link: '/chats/20'
   },

   {
      id: '21',
      name: 'Umar Farooq',
      email: 'umar.farooq@example.com',
      src: '/avatar21.png',
      online: true,
      link: '/chats/21'
   },
   {
      id: '22',
      name: 'Victoria Hall',
      email: 'victoria.hall@example.com',
      src: '/avatar22.png',
      online: false,
      link: '/chats/22'
   },
   {
      id: '23',
      name: 'William Turner',
      email: 'william.turner@example.com',
      src: '/avatar23.png',
      online: true,
      link: '/chats/23'
   },
   {
      id: '24',
      name: 'Xavier Cruz',
      email: 'xavier.cruz@example.com',
      src: '/avatar24.png',
      online: false,
      link: '/chats/24'
   },
   {
      id: '25',
      name: 'Yara Hassan',
      email: 'yara.hassan@example.com',
      src: '/avatar25.png',
      online: true,
      link: '/chats/25'
   },
   {
      id: '26',
      name: 'Zain Malik',
      email: 'zain.malik@example.com',
      src: '/avatar26.png',
      online: false,
      link: '/chats/26'
   },
   {
      id: '27',
      name: 'Adam Wilson',
      email: 'adam.wilson@example.com',
      src: '/avatar27.png',
      online: true,
      link: '/chats/27'
   },
   {
      id: '28',
      name: 'Bella Martinez',
      email: 'bella.martinez@example.com',
      src: '/avatar28.png',
      online: false,
      link: '/chats/28'
   },
   {
      id: '29',
      name: 'Chris Anderson',
      email: 'chris.anderson@example.com',
      src: '/avatar29.png',
      online: true,
      link: '/chats/29'
   },
   {
      id: '30',
      name: 'Dana Peterson',
      email: 'dana.peterson@example.com',
      src: '/avatar30.png',
      online: false,
      link: '/chats/30'
   },

   {
      id: '31',
      name: 'Elias Gomez',
      email: 'elias.gomez@example.com',
      src: '/avatar31.png',
      online: true,
      link: '/chats/31'
   },
   {
      id: '32',
      name: 'Farah Ali',
      email: 'farah.ali@example.com',
      src: '/avatar32.png',
      online: false,
      link: '/chats/32'
   },
   {
      id: '33',
      name: 'Gabriel Stone',
      email: 'gabriel.stone@example.com',
      src: '/avatar33.png',
      online: true,
      link: '/chats/33'
   },
   {
      id: '34',
      name: 'Helena Brooks',
      email: 'helena.brooks@example.com',
      src: '/avatar34.png',
      online: false,
      link: '/chats/34'
   },
   {
      id: '35',
      name: 'Ivan Petrov',
      email: 'ivan.petrov@example.com',
      src: '/avatar35.png',
      online: true,
      link: '/chats/35'
   }
]
interface UserListProps {
   users: typeof contacts
}

function UserList({ users }: UserListProps) {
   const [isSelecting, setIsSelecting] = useState(false)
   const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

   // Toggle Selection Mode
   const toggleSelectionMode = useCallback(() => {
      setIsSelecting(prev => {
         if (!prev) {
            setSelectedUserIds([]) // Clear selection when entering mode
         }
         return !prev
      })
   }, [])

   // Handle Selecting/Deselecting a user
   const handleUserSelect = useCallback((id: string) => {
      setSelectedUserIds(prev => {
         if (prev.includes(id)) {
            return prev.filter(userId => userId !== id)
         } else {
            return [...prev, id]
         }
      })
   }, [])

   // Handle Delete Action
   const handleDelete = useCallback(() => {
      if (selectedUserIds.length === 0) return

      console.log('Deleting users:', selectedUserIds)
      // Perform API call here to delete from DB
      // e.g. await fetch('/api/users/delete', { method: 'POST', body: JSON.stringify({ ids: selectedUserIds }) })

      toast.success(`Deleted ${selectedUserIds.length} users`)

      // Reset State
      setIsSelecting(false)
      setSelectedUserIds([])
   }, [selectedUserIds])

   // Handle Share Action
   const handleShare = useCallback(() => {
      if (selectedUserIds.length === 0) return

      console.log('Sharing users:', selectedUserIds)
      // Perform API call or clipboard action
      // e.g. navigator.clipboard.writeText(`Check out these users: ${selectedUserIds.join(',')}`)

      toast.success(`Shared ${selectedUserIds.length} users`)

      // Reset State
      setIsSelecting(false)
      setSelectedUserIds([])
   }, [selectedUserIds])

   return (
      <div className='relative flex h-full w-full flex-col justify-between'>
         {/* Header with Selection Trigger */}
         <QuickDropDown
            toggleSelectionMode={toggleSelectionMode}
            isSelecting={isSelecting}
         />
         {/* Scrollable List Area */}

         <div className='flex flex-col lg:grid lg:grid-cols-2 justify-center p-3 gap-1 mt-14'>
            {users.length === 0 ? (
               <Empty className='h-[90vh] col-span-2'>
                  <EmptyHeader className='w-full'>
                     <EmptyMedia className='m-5 -rotate-[30deg]'>
                        <Logo />
                     </EmptyMedia>
                     <EmptyTitle>No Chat Yet.</EmptyTitle>
                     <EmptyDescription>
                        This catagory doesn't contain any users.
                     </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                     <Link href='/settings/catagory'>
                        <Button>
                           <Folders />
                           <span>Add Users</span>
                        </Button>
                     </Link>
                  </EmptyContent>
               </Empty>
            ) : (
               users.map(contact => (
                  <UserItem
                     key={contact.id}
                     id={contact.id}
                     lastMsg={contact.lastMsg}
                     link={contact.link + contact.id}
                     avatar={contact.src}
                     name={contact.name}
                     email={contact.email}
                     online={contact.online}
                     isSelecting={isSelecting}
                     isSelected={selectedUserIds.includes(contact.id)}
                     onSelect={handleUserSelect}
                  />
               ))
            )}
         </div>

         {/* Bottom Action Bar (Similar to InteractiveImageSelector) */}
         <AnimatePresence>
            {isSelecting && (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className='fixed bottom-5 w-[90%] left-[5%] md:w-[60%] md:left-[20%] shadow-lg z-30 flex items-center justify-around rounded-2xl bg-background/95 p-4 backdrop-blur'
               >
                  <span className='text-sm font-black text-muted-foreground'>
                     {selectedUserIds.length} selected
                  </span>

                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={toggleSelectionMode}
                     className='text-muted-foreground hover:bg-muted-foreground/30'
                  >
                     <X size={25} />
                  </Button>

                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={handleShare}
                     disabled={selectedUserIds.length === 0}
                     className='text-muted-foreground hover:bg-muted-foreground/30'
                  >
                     <Share2 size={25} />
                  </Button>

                  <Button
                     variant='ghost'
                     size='icon'
                     onClick={handleDelete}
                     disabled={selectedUserIds.length === 0}
                     className='text-destructive hover:bg-destructive/30'
                  >
                     <Trash2 size={25} />
                  </Button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}

// demo-categories.ts
export const chatCategories = [
   {
      id: 'all',
      title: 'All',
      color: 'bg-primary',
      users: contacts // reuse your existing contacts
   },
   {
      id: 'friends',
      title: 'Friends',

      users: contacts.filter((_, i) => i % 2 === 0)
   },
   {
      id: 'Dev',
      title: 'Friends',

      users: contacts.filter((_, i) => i % 3 === 0)
   },
   {
      id: 'Docs',
      title: 'Friends',

      users: contacts.filter((_, i) => i % 5 === 0)
   },
   {
      id: 'work',
      title: 'Work',

      users: contacts.filter((_, i) => i % 2 !== 0)
   },
   {
      id: 'archived',
      title: 'Archived',

      users: []
   }
]

export default function CategorizedChats() {
   const [activeCategory, setActiveCategory] = useState(chatCategories[0].id)

   const currentCategory = chatCategories.find(c => c.id === activeCategory)

   return (
      <div className='h-full w-full mb-16'>
         {/* CATEGORY CONTENT */}
         <UserList users={currentCategory?.users || []} />

         {/* CATEGORY TABS */}
         <SmoothTab
            items={chatCategories.map(c => ({
               id: c.id,
               title: c.title
            }))}
            value={activeCategory}
            onChange={setActiveCategory}
         />
      </div>
   )
}

export function QuickDropDown({ isSelecting, toggleSelectionMode }) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger
            asChild
            className={`${
               isSelecting && 'hidden'
            } fixed top-2 right-14 z-10 p-3 flex justify-center items-center`}
         >
            <Button
               variant='ghost'
               size='icon'
            >
               <MoreVertical
                  strokeWidth={4}
                  className='size-5'
               />
               <span className='sr-only'>Open menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align='end'>
            <DropdownMenuItem
               onClick={toggleSelectionMode}
               className='flex justify-between items-center'
            >
               <span>{isSelecting ? 'Cancel Selection' : 'Select Users'}</span>
               <List />
            </DropdownMenuItem>
            <Link href='/settings/catagory'>
               <DropdownMenuItem className='flex justify-between items-center'>
                  <span>Catagorys</span>
                  <Folders />
               </DropdownMenuItem>
            </Link>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
