'use client'

import ProfileSettings from '@/components/layout/user/profile-settings'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import {
   Calendar,
   MapPin,
   MoreHorizontal,
   MessageCircle,
   Briefcase,
   Pencil
} from 'lucide-react'
import {
   Sheet,
   SheetContent,
   SheetTrigger,
   SheetTitle
} from '@/components/ui/sheet'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function Profile() {
   const { data: session } = authClient.useSession()
   if (!session) {
      return null
   }
   const { user } = session

   /*const session = {
      user: {
         name: 'Amanuel Antenh',
         email: 'amanuelantenha@gmail.com',
         image: '/avatar.png',
         bio: `Product Designer & Frontend Developer. Passionate about
                        building beautiful, accessible user interfaces. Creating
                        digital experiences that matter. ✨`,
         country: 'Ethiopia',
         job: 'full  Stack  Web  Developer'
      }
   }*/

   return (
      <div className=''>
         {/* Cover Image with Gradient Animation */}
         <div
            className='relative h-48 md:h-64 w-full overflow-hidden rounded-b-2xl'
            role='img'
            aria-label='Profile cover background'
         >
            <motion.div
               className='absolute inset-0'
               animate={{
                  background: [
                     'linear-gradient(45deg, #cab300 0%, #ffe200 100%)',
                     'linear-gradient(45deg, #ffe200 0%, #cab300 100%)'
                  ]
               }}
               transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'linear'
               }}
            />
            <div className='absolute inset-0 bg-black/10' />
         </div>

         <div className='container max-w-4xl mx-auto px-4 sm:px-6 pb-6'>
            {/* Profile Header */}
            <div className='relative -mt-8 sm:-mt-8 mb-6 sm:mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between'>
               <div className='flex items-end gap-4 sm:gap-6'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className='relative'
                  >
                     <div className='h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded border-4 border-background bg-background shadow-xl'>
                        <Avatar className='h-full w-full rounded'>
                           <AvatarImage
                              src={user.image || ''}
                              alt={user.name || ''}
                              className='object-cover'
                           />
                           <AvatarFallback className='text-2xl sm:text-4xl'>
                              {user.name.slice(0, 1)}
                           </AvatarFallback>
                        </Avatar>
                     </div>
                     <div
                        className='absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-2xl border-4 border-background bg-emerald-500'
                        aria-label='Online status: Active'
                        role='status'
                     />
                  </motion.div>

                  <div className='mb-1 sm:mb-2 space-y-0.5 sm:space-y-1'>
                     <h1 className='text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                        {user.name || ''}
                     </h1>
                     <p className='text-sm sm:text-base text-muted-foreground'>
                        {user.email || ''}
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

                  <Sheet>
                     <SheetTrigger asChild>
                        <Button
                           variant='outline'
                           className='flex-1 md:flex-none'
                           aria-label='Edit profile'
                        >
                           <Pencil />
                           Edit
                        </Button>
                     </SheetTrigger>
                     <SheetContent>
                        <SheetTitle className='sr-only'>
                           Edit Profile Settings
                        </SheetTitle>
                        <ProfileSettings />
                     </SheetContent>
                  </Sheet>
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
                        <DropdownMenuLabel>More</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href='/profile/settings'>
                           <DropdownMenuItem>Settings</DropdownMenuItem>
                        </Link>
                        <Link
                           href='/'
                           onClick={() => authClient.signOut()}
                        >
                           <DropdownMenuItem>Log out</DropdownMenuItem>
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
                        {user.bio || '-'}
                     </p>

                     <div className='flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1.5'>
                           <MapPin
                              className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              aria-hidden='true'
                           />
                           <span> {user.country || '-'}</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                           <Briefcase
                              className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              aria-hidden='true'
                           />
                           <span> {user.job || '-'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </div>
   )
}
