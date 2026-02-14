'use client'

import { useState } from 'react'
import { Bitshow } from '@/components/font/font'
import { Mail, Lock, ChevronRightIcon, User, Smile } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
   Drawer,
   DrawerContent,
   DrawerTitle,
   DrawerTrigger
} from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog2'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'
import { ProfileDropdown } from '@/components/ui/profile-dropdown'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

// Import the block components
import { PersonalDetailsOperation } from './blocks/personal-details-update'
import { AvatarOperation } from './blocks/avatar-update'
import { EmailOperation } from './blocks/email-update'
import { PasswordOperation } from './blocks/pw-update'

export default function AccountSettings() {
   const isMobile = useIsMobile()
   const { data: session, refetch } = authClient.useSession()
   const [avatarKey, setAvatarKey] = useState(Date.now()) // Force avatar re-render

   if (!session) return null

   const handleAvatarUpdated = (newImageUrl: string) => {
      // Update the session data optimistically
      if (session.user) {
         session.user.image = newImageUrl
         setAvatarKey(Date.now())
      }
      // Optionally refetch to ensure consistency
      refetch()
   }

   const handleDetailsUpdated = () => {
      refetch() // Refresh session data
   }

   return (
      <div>
         <h1
            className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
         >
            Account
         </h1>
         <p className='text-muted-foreground text-xs text-center'>
            Update your personal details, email, bio, password, and profile
            picture also add job and location.
         </p>

         <div className='mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 justify-center'>
            <div className='w-full flex justify-center items-center col-span-2'>
               <ProfileDropdown
                  key={avatarKey} // Re-render when avatar changes
                  data={session.user}
               />
            </div>

            {/* Settings Items */}
            {isMobile ? (
               <>
                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Smile />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Profile Picture</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>Avatar</DrawerTitle>
                        <AvatarOperation
                           session={session}
                           onAvatarUpdated={handleAvatarUpdated}
                        />
                     </DrawerContent>
                  </Drawer>

                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <User />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Personal Details</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>
                           Personal Details
                        </DrawerTitle>
                        <PersonalDetailsOperation
                           session={session}
                           onSuccess={handleDetailsUpdated}
                        />
                     </DrawerContent>
                  </Drawer>

                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Mail />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Email</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>Email</DrawerTitle>
                        <EmailOperation session={session} />
                     </DrawerContent>
                  </Drawer>

                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Lock />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Password</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>Password</DrawerTitle>
                        <PasswordOperation />
                     </DrawerContent>
                  </Drawer>
               </>
            ) : (
               <>
                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Smile />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Profile Picture</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <AvatarOperation
                           session={session}
                           onAvatarUpdated={handleAvatarUpdated}
                        />
                     </DialogContent>
                  </Dialog>

                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <User />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Personal Details</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <PersonalDetailsOperation
                           session={session}
                           onSuccess={handleDetailsUpdated}
                        />
                     </DialogContent>
                  </Dialog>

                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Mail />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Email</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <EmailOperation session={session} />
                     </DialogContent>
                  </Dialog>

                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Lock />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Password</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <PasswordOperation />
                     </DialogContent>
                  </Dialog>
               </>
            )}
         </div>

         {/* Additional Info Card */}
         <Card className='m-2'>
            <CardContent>
               <CardTitle>Additional Info</CardTitle>
               <div className='md:grid md:grid-cols-2 lg:grid-cols-3'>
                  <p className='text-sm text-muted-foreground my-2'>
                     Joined at{' '}
                     <span className='text-foreground font-black'>
                        {new Date(session.user.createdAt).toLocaleDateString()}
                     </span>
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     Last profile update at{' '}
                     <span className='text-foreground font-black'>
                        {new Date(session.user.updatedAt).toLocaleDateString()}
                     </span>
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>52</span>{' '}
                     Total Chat Contacts
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>342</span>{' '}
                     Total Messages
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>2</span> Total
                     Pinned Chats
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>0</span> Total
                     Blocked Users
                  </p>
               </div>
            </CardContent>
         </Card>

         <p className='text-muted-foreground text-center'>
            <Link
               href='/legal'
               className='text-sm text-foreground underline underline-offset-4'
            >
               Terms of Service
            </Link>{' '}
            and{' '}
            <Link
               href='/legal'
               className='text-sm text-foreground underline underline-offset-4'
            >
               Privacy Policy
            </Link>
         </p>
      </div>
   )
}
