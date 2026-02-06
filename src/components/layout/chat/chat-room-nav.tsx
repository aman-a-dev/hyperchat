import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
   EllipsisVertical,
   BrushCleaning,
   User,
   ShieldX,
   ArrowLeft,
   Key
} from 'lucide-react'
import Link from 'next/link'

export default function ChatRoomNav({
   link = '/',
   avatar,
   name = 'Amanuel Anteneh',
   email = 'amanarttik@gmail.com'
}) {
   return (
      <header className='flex items-center fixed top-0 left-0 right-0 w-full z-10 bg-background/50 backdrop-blur p-1 rounded-md shadow-md w-full px-2 border-b'>
         <Link href='/chats'>
            <Button variant='ghost'>
               <ArrowLeft />
            </Button>
         </Link>
         <Link
            href={link}
            className='flex items-center gap-2 mr-auto'
         >
            <Avatar className='rounded-[30%/30%] shadow-lg h-10 w-10'>
               <AvatarImage src={avatar} />
               <AvatarFallback className='rounded-[30%/30%] shadow-lg'>
                  {name.slice(0, 1)}
               </AvatarFallback>
            </Avatar>
            <div className='overflow-auto'>
               <h4 className='scroll-m-20 text-sm font-semibold tracking-tight'>
                  {email}
               </h4>
               <p className='text-muted-foreground text-xs'>online</p>
            </div>
         </Link>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant='ghost'>
                  <EllipsisVertical />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align='end'
               className='w-40'
            >
               <Link href={link}>
                  <DropdownMenuItem className='flex justify-between items-center '>
                     <span>View Profile</span>
                     <User className='size-4' />
                  </DropdownMenuItem>
               </Link>
               <DropdownMenuItem className='flex justify-between items-center'>
                  <span>Clear History</span>
                  <BrushCleaning className='size-4' />
               </DropdownMenuItem>
               <DropdownMenuItem className='flex justify-between items-center'>
                  <span>Incognito Chat</span>
                  <Key className='size-4' />
               </DropdownMenuItem>
               <DropdownMenuSeparator className='bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800' />
               <DropdownMenuItem className='flex justify-between items-center text-primary'>
                  <span>Block</span>
                  <ShieldX className='size-4' />
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </header>
   )
}
