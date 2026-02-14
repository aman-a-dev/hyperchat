'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { authClient } from '@/lib/auth-client'
import {
   MapPin,
   MoreHorizontal,
   MessageCircle,
   Briefcase,
   Pencil,
   Settings,
   LogOut
} from 'lucide-react'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import FadeUp from '@/animation/fade-up'
import { Spinner } from '@/components/ui/spinner'

export default function Profile() {
   const { data: session } = authClient.useSession()

   return (
      <FadeUp>
         {/* Top */}
         <div
            className='h-5'
            role='img'
            aria-label='Profile cover background'
         ></div>

         <div className='container max-w-4xl mx-auto px-4 sm:px-6 pb-6'>
            {/* Profile Header */}
            <div className='relative -mt-8 sm:-mt-8 mb-6 sm:mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between'>
               <div className='flex items-end gap-4 sm:gap-6'>
                  <motion.div
                     initial={{ scale: 0.1, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className='relative'
                  >
                     <div className='h-30 w-30 sm:h-35 sm:w-35 overflow-hidden rounded-[30%/30%] border-4 border-background bg-background shadow-xl'>
                        <Avatar className='h-full w-full rounded-[30%/30%]'>
                           <AvatarImage
                              src={session?.user.image}
                              alt={session?.user.name || ''}
                              className='object-cover'
                           />
                           <AvatarFallback className='text-2xl sm:text-4xl'>
                              {session?.user.name.slice(0, 1)}
                           </AvatarFallback>
                        </Avatar>
                     </div>
                     <div className='absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-6 w-6 rounded-2xl border-4 border-background bg-primary'></div>
                  </motion.div>

                  <div className='mb-1 sm:mb-2 space-y-0.5 sm:space-y-1'>
                     <h1 className='text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                        {session?.user.name || ''}
                     </h1>
                     <p className='text-sm sm:text-base text-muted-foreground'>
                        {session?.user.email || ''}
                     </p>
                  </div>
               </div>

               <div className='flex w-full gap-2 sm:gap-3 md:w-auto md:mb-2'>
                  <Button
                     className={cn('flex-1 md:flex-none gap-2 transition-all')}
                  >
                     <MessageCircle
                        className='h-4 w-4'
                        aria-hidden='true'
                     />
                     Chat
                  </Button>
                  <Link href='/settings/account'>
                     <Button
                        variant='outline'
                        className='flex-1 md:flex-none'
                        aria-label='Edit profile'
                     >
                        <Pencil />
                        Edit
                     </Button>
                  </Link>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant='ghost'
                           size='icon'
                           className='border border-border/40'
                           aria-label='More profile options'
                        >
                           <MoreHorizontal
                              className='h-4 w-4'
                              aria-hidden='true'
                           />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuLabel className='text-xs text-muted-foreground'>
                           More
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className='bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800' />

                        <Link href='/settings'>
                           <DropdownMenuItem>
                              <Settings />
                              <span>Settings</span>
                           </DropdownMenuItem>
                        </Link>
                        <Link
                           href='/'
                           onClick={() => authClient.signOut()}
                        >
                           <DropdownMenuItem>
                              <LogOut />
                              <span>Log out</span>
                           </DropdownMenuItem>
                        </Link>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>

            {/* Bio & Stats */}
            <section
               aria-label='User bio and statistics'
               className='grid gap-8 md:grid-cols-[2fr,1fr]'
            >
               <div className='space-y-6'>
                  <div className='space-y-4'>
                     <p className='text-sm sm:text-base leading-relaxed text-foreground/90'>
                        {session?.user.bio || '-'}
                     </p>

                     <div className='flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1.5'>
                           <MapPin
                              className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              aria-hidden='true'
                           />
                           <span> {session?.user.country || '-'}</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                           <Briefcase
                              className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              aria-hidden='true'
                           />
                           <span> {session?.user.job || '-'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </FadeUp>
   )
}
