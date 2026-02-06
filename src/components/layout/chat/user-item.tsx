'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils' // Assuming you have a utility for classnames, or just use template literals

interface UserItemProps {
   link?: string
   avatar?: string
   name?: string
   email?: string
   online?: boolean
   id: string | number // Required for selection
   lastMsg: string

   // Selection Props
   isSelecting?: boolean
   isSelected?: boolean
   onSelect?: (id: string | number) => void
}

export default function UserItem({
   link = '/chat',
   avatar = '/avatar.png',
   name = 'jone doe',
   email = 'jonedoe@gmail.com',
   online,
   id,
   lastMsg,
   isSelecting = false,
   isSelected = false,
   onSelect
}: UserItemProps) {
   const handleItemClick = () => {
      if (isSelecting && onSelect) {
         onSelect(id)
      }
   }

   return (
      <motion.div
         initial={{ y: 50, opacity: 0 }}
         whileInView={{ y: 0, opacity: 1 }}
         viewport={{ once: false }}
         transition={{ duration: 0.5, type: 'spring' }} // Reduced duration slightly for snappier feel
         className='mb-1'
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
            {/* Left Side: Checkbox (if selecting) or Avatar */}
            <div className='flex flex-1 items-center gap-3 overflow-hidden pl-2'>
               {isSelecting && (
                  <div
                     className={cn(
                        'flex h-5 w-5 border-muted-foreground  items-center justify-center rounded-full border transition-colors',
                        isSelected
                           ? 'bg-brand dark:text-white'
                           : 'text-transparent'
                     )}
                  >
                     <Check
                        size={13}
                        strokeWidth={3}
                     />
                  </div>
               )}

               <Link
                  href={isSelecting ? '#' : link} // Prevent navigation if selecting
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
                     <ItemTitle>{name}</ItemTitle>
                     <ItemDescription className='truncate text-sm'>
                        {email}
                     </ItemDescription>
                     <p className='text-xs text-muted-foreground whitespace-nowrap'>
                       {lastMsg && `■ ${lastMsg}`}
                     </p>
                  </ItemContent>
               </Link>
            </div>
            {/* Right Side: Dropdown Menu (Only if NOT selecting) */}
            {!isSelecting && (
               <DropdownMenu>
                  <Button
                     variant='ghost'
                     className='h-8 w-8 p-0'
                  >
                     <DropdownMenuTrigger asChild>
                        <ItemActions className='cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors'>
                           <EllipsisVertical className='size-5' />
                        </ItemActions>
                     </DropdownMenuTrigger>
                  </Button>

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
                     <DropdownMenuItem className='flex justify-between items-center text-primary'>
                        <span>Delete</span>
                        <Trash className='size-4' />
                     </DropdownMenuItem>
                     <DropdownMenuItem className='flex justify-between items-center text-primary'>
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
