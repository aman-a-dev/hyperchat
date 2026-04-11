'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemDescription,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
   EllipsisVertical,
   Pin,
   BrushCleaning,
   Trash,
   ShieldX,
   MessageCircle,
   Check
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface UserItemProps {
   link?: string
   avatar?: string
   name?: string
   email?: string
   online?: boolean
   id: string
   lastMsg: string
   unreadCount?: number
   isSelecting?: boolean
   isSelected?: boolean
   onSelect?: (id: string) => void
}

export default function UserItem({
   link = '/chats',
   avatar = '/',
   name = '',
   email = '',
   online,
   id,
   lastMsg,
   unreadCount = 0,
   isSelecting = false,
   isSelected = false,
   onSelect
}: UserItemProps) {
   const handleItemClick = () => {
      if (isSelecting && onSelect) onSelect(id)
   }

   return (
      <motion.div
         initial={{ y: 50, opacity: 0 }}
         whileInView={{ y: 0, opacity: 1 }}
         viewport={{ once: false }}
         transition={{ duration: 0.5, type: 'spring' }}
         className='mb-1 bg-card/50 backdrop-blur-md'
      >
         <Item
            variant='outline'
            className={cn(
               'flex items-center justify-between gap-2 cursor-pointer transition-all duration-200',
               {
                  'bg-secondary/50 border-secondary': isSelected,
                  'hover:bg-secondary/30': !isSelecting
               }
            )}
            onClick={handleItemClick}
         >
            <div className='flex flex-1 items-center gap-3 overflow-hidden pl-2'>
               {isSelecting && (
                  <div
                     className={cn(
                        'flex h-5 w-5 border-muted-foreground items-center justify-center rounded-full border transition-colors',
                        isSelected
                           ? 'bg-brand dark:text-white'
                           : 'text-transparent'
                     )}
                     aria-hidden='true'
                  >
                     <Check
                        size={13}
                        strokeWidth={3}
                     />
                  </div>
               )}

               <Link
                  href={isSelecting ? '#' : link}
                  className='flex flex-1 items-center gap-3 overflow-hidden'
                  onClick={e => isSelecting && e.preventDefault()}
               >
                  <ItemMedia>
                     <div className='relative'>
                        <Avatar className='w-13 h-13 rounded-md mb-2'>
                           <AvatarImage
                              alt={name}
                              src={avatar}
                              className='rounded-[30%/30%]'
                           />
                           <AvatarFallback className='rounded-md'>
                              {name.slice(0, 1).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                        {online && (
                           <span className='-end-1 -top-1 absolute size-4 rounded-full border-2 border-background bg-primary'>
                              <span className='sr-only'>Online</span>
                           </span>
                        )}
                     </div>
                  </ItemMedia>
                  <ItemContent>
                     <div className='flex items-center gap-2'>
                        <ItemTitle>{name}</ItemTitle>
                        {unreadCount > 0 && (
                           <Badge
                              variant='default'
                              className='text-xs'
                           >
                              {unreadCount}
                           </Badge>
                        )}
                     </div>
                     <ItemDescription className='truncate text-sm'>
                        {email}
                     </ItemDescription>
                     <p className='text-xs text-muted-foreground whitespace-nowrap'>
                        {lastMsg && `■ ${lastMsg}`}
                     </p>
                  </ItemContent>
               </Link>
            </div>

            {!isSelecting && (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant='ghost'
                        className='h-8 w-8 p-0'
                     >
                        <ItemActions className='cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors'>
                           <EllipsisVertical className='size-5' />
                        </ItemActions>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     align='end'
                     className='w-48'
                  >
                     <DropdownMenuLabel className='text-muted-foreground text-xs md:text-base'>
                        User Options
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator className='bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800' />
                     <DropdownMenuItem className='flex justify-between items-center'>
                        <span>Chat</span>
                        <MessageCircle className='size-4' />
                     </DropdownMenuItem>
                     <DropdownMenuItem className='flex justify-between items-center'>
                        <span>Pin</span>
                        <Pin className='size-4' />
                     </DropdownMenuItem>
                     <DropdownMenuItem className='flex justify-between items-center'>
                        <span>Clear History</span>
                        <BrushCleaning className='size-4' />
                     </DropdownMenuItem>
                     <DropdownMenuSeparator className='bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800' />
                     <DropdownMenuItem className='flex justify-between items-center text-destructive focus:text-destructive'>
                        <span>Delete</span>
                        <Trash className='size-4' />
                     </DropdownMenuItem>
                     <DropdownMenuItem className='flex justify-between items-center text-destructive focus:text-destructive'>
                        <span>Block</span>
                        <ShieldX className='size-4' />
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            )}
         </Item>
      </motion.div>
   )
}
