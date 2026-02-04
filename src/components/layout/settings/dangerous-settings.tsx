'use client'
import { Bitshow } from '@/components/font/font'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogTrigger,
   DialogTitle,
   DialogHeader,
   DialogClose
} from '@/components/ui/dialog'
import { Trash, MessageCircle, AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PowerOffSlide } from '@/components/ui/power-off-slide'
import { useRef } from 'react'
export default function DangerousSettings() {
   const delbtnRef = useRef()
   return (
      <div>
         <h1
            className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
         >
            Danger Zone
         </h1>
         <p className='text-muted-foreground text-xs text-center'>
            Perform dangerous activities on your account.
         </p>
         <div className='mt-5 p-2 flex flex-col gap-2 justify-center md:grid md:grid-cols-2 lg:mx-10'>
            <Dialog>
               <DialogTrigger asChild>
                  <Button variant='destructive'>
                     <span>Delete Account</span>
                     <Trash />
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader className='flex flex-col justify-center items-center'>
                     <AlertCircleIcon className='size-15' />
                     <DialogTitle className='text-center text-2xl'>
                        Delete Hyperchat account permanently
                     </DialogTitle>
                  </DialogHeader>
                  <Alert variant='destructive'>
                     <AlertCircleIcon />
                     <AlertTitle>Important Note</AlertTitle>
                     <AlertDescription>
                        <p>
                           When you click{' '}
                           <span className='text-destructive font-black'>
                              Delete
                           </span>{' '}
                           we will send a confirmation email to your email when
                           you confirm your account will be deleted.Your account
                           wouldn't be deleted until you confirm.
                        </p>
                     </AlertDescription>
                  </Alert>
                  <PowerOffSlide
                     label='Delete my account'
                     onPowerOff={() => delbtnRef.current.click()}
                  />
                  <Button
                     variant='destructive'
                     className='sr-only'
                     ref={delbtnRef}
                  >
                     Delete
                  </Button>
               </DialogContent>
            </Dialog>
            <Dialog>
               <DialogTrigger asChild>
                  <Button variant='destructive'>
                     <span>Clear All Chats</span>
                     <MessageCircle />
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader className='flex flex-col justify-center items-center'>
                     <AlertCircleIcon className='size-15' />
                     <DialogTitle className='text-center text-2xl'>
                        Clean all of your chat history.
                     </DialogTitle>
                  </DialogHeader>
                  <Alert variant='destructive'>
                     <AlertCircleIcon />
                     <AlertTitle>Important Note</AlertTitle>
                     <AlertDescription>
                        <p>
                           This activity will delete all of your chats from both
                           participants.
                        </p>
                     </AlertDescription>
                  </Alert>

                  <Button variant='destructive'>Delete</Button>
                  <DialogClose asChild>
                     <Button variant='outline'>Cancel</Button>
                  </DialogClose>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   )
}
