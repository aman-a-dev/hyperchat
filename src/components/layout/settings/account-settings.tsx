'use client'
import { Bitshow } from '@/components/font/font'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
   Field,
   FieldDescription,
   FieldLabel,
   FieldLegend
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import {
   Drawer,
   DrawerContent,
   DrawerTitle,
   DrawerTrigger
} from '@/components/ui/drawer'
import {
   Mail,
   Lock,
   ChevronRightIcon,
   User,
   Building,
   Earth,
   Smile,
   Sparkles,
   UploadCloud
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { PwInput } from '@/components/ui/pw-input'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProfileDropdown } from '@/components/ui/profile-dropdown'
//import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import {
   validateChangeUserData,
   validateImageType,
   validateEmail,
   validatePassWord
} from '@/actions/validation'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

export default function AccountSettings() {
   // const { data: session } = authClient.useSession()
   // if (!session) {
   //     return null
   // }
   const session = {
      user: {
         name: 'Amanuel Antenh',
         email: 'amanuelantenha@gmail.com',
         image: '/avatar.png',
         bio: `Product Designer & Frontend Developer. Passionate about building beautiful, accessible user interfaces. Creating digital experiences that matter. ✨`,
         country: '',
         job: ''
      }
   }
   //const { user } = session
   const isMobile = useIsMobile()

   return (
      <div>
         <h1
            className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
         >
            Account
         </h1>
         <p className='text-muted-foreground text-xs text-center'>
            Update your personal details, email,bio, password,and profile
            picture also add job and location.
         </p>
         <div className='mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 justify-center'>
            <div className='w-full flex justify-center items-center col-span-2'>
               <ProfileDropdown />
            </div>
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
                        <AvatarOpration session={session} />
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
                        <DrawerTitle className='sr-only'>Email</DrawerTitle>
                        <PersonalDetailsOpration session={session} />
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
                        <EmailOpration session={session} />
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
                        <PasswordOpration />
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
                        <DrawerTitle className='sr-only'>Email</DrawerTitle>
                        <AvatarOpration session={session} />
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
                        <DrawerTitle className='sr-only'>Email</DrawerTitle>
                        <PersonalDetailsOpration session={session} />
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
                        <DrawerTitle className='sr-only'>Email</DrawerTitle>
                        <EmailOpration session={session} />
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
                        <DrawerTitle className='sr-only'>Password</DrawerTitle>
                        <PasswordOpration />
                     </DialogContent>
                  </Dialog>
               </>
            )}
         </div>
         <Card className='m-2'>
            <CardContent>
               <CardTitle>Additional Info</CardTitle>
               <div className='md:grid md:grid-cols-2 lg:grid-cols-3'>
                  <p className='text-sm  text-muted-foreground my-2'>
                     Joined at{' '}
                     <span className='text-foreground font-black'>
                        15/07/2025
                     </span>
                  </p>
                  <p className='text-sm  text-muted-foreground my-2'>
                     last profile update at{' '}
                     <span className='text-foreground font-black'>
                        20/05/2025
                     </span>
                  </p>
                  <p className='text-sm  text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>52</span>{' '}
                     Total Chat Contacts
                  </p>
                  <p className='text-sm  text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>342</span>{' '}
                     Total Messages
                  </p>
                  <p className='text-sm  text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>2</span> Total
                     Pined Chats
                  </p>
                  <p className='text-sm  text-muted-foreground my-2'>
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

function PersonalDetailsOpration({ session }) {
   const handleChangeData = async e => {
      const form = new FormData(e.currentTarget)
      const name = form.get('name')
      const bio = form.get('bio')
      const job = form.get('job')
      const country = form.get('country')

      try {
         const isValid = validateChangeUserData(name, bio, job, country)
         if (isValid) {
            const { error } = await authClient.updateUser({
               name: 'John Doe'
            })
            if (error) {
               toast.error('An Error Occurred', {
                  description: error
               })
            }
         }
         toast.success('Your data updated successfuly')
      } catch (err) {
         toast.error('An Error Occurred', {
            description: err
         })
      }
   }
   return (
      <form
         onSubmit={handleChangeData}
         className='p-5 overflow-auto'
      >
         <Field>
            <FieldLegend>Update your personal details</FieldLegend>
            <FieldLabel htmlFor='name'>Name</FieldLabel>
            <div className='relative '>
               <Input
                  id='name'
                  name='name'
                  placeholder={session.user.name}
                  className='peer ps-9 rounded-xl'
               />
               <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <Smile
                     size={16}
                     aria-hidden='true'
                  />
               </div>
            </div>
            <FieldDescription>
               Your name to display it at your profile.
            </FieldDescription>
            <FieldLabel htmlFor='bio'>Bio</FieldLabel>
            <Textarea
               id='bio'
               bio='bio'
               placeholder={session.user.bio || 'about me in short ℹ️'}
               className='rounded-xl'
            />
            <FieldDescription>
               Describe your self in just 100 words.
            </FieldDescription>
            <FieldLabel htmlFor='job'>Job</FieldLabel>
            <div className='relative'>
               <Input
                  id='job'
                  job='job'
                  placeholder={session.user.job || 'Doctor 👨‍⚕️'}
                  className='peer ps-9 rounded-xl'
               />
               <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <Building
                     size={16}
                     aria-hidden='true'
                  />
               </div>
            </div>
            <FieldDescription>Your current job (optional)</FieldDescription>
            <FieldLabel htmlFor='country'>Country</FieldLabel>
            <div className='relative '>
               <Input
                  id='country'
                  country='country'
                  placeholder={session.user.country || 'Ethiopia 🇪🇹'}
                  className='peer ps-9 rounded-xl'
               />
               <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <Earth
                     size={16}
                     aria-hidden='true'
                  />
               </div>
            </div>
            <FieldDescription>
               Your current resident country name (optional)
            </FieldDescription>
            <Button type='submit'>Save Changes</Button>
         </Field>
      </form>
   )
}
function AvatarOpration({ session }) {
   const handleChangeAvatar = async e => {
      const form = new FormData(e.currentTarget)
      const avatar = form.get('avatar')

      try {
         const isValid = validateImageType(type)
         if (isValid) {
            const { error } = await authClient.updateUser({
               image: avatar
            })
            if (error) {
               toast.error('An Error Occurred', {
                  description: error
               })
            }
            toast.success('Your profile picture changed successfully. ')
         }
      } catch (err) {
         toast.error('An Error Occurred', {
            description: err
         })
      }
   }
   return (
      <form
         onSubmit={handleChangeAvatar}
         className='p-5'
      >
         <Field>
            <FieldLegend className='text-center'>
               Update your Avatar
            </FieldLegend>
            <FieldLabel
               htmlFor='file'
               className='flex items-center justify-center relative'
            >
               <div className='inset-0 bg-background/40 absolute flex items-center justify-center flex-col z-10'>
                  <span>Upload</span>
                  <UploadCloud />
               </div>
               <Avatar className='rounded-[30%/30%] h-36 w-36'>
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback className='rounded-[30%/30%]'>
                     {session.user.name.slice(0, 1)}
                  </AvatarFallback>
               </Avatar>
            </FieldLabel>
            <Input
               required
               id='file'
               type='file'
               name='avatar'
               className='hidden'
            />

            <Button type='button'>
               <span>AI Avatar</span>
               <Sparkles />
            </Button>
            <Button type='submit'>Save Changes</Button>
         </Field>
      </form>
   )
}
function EmailOpration({ session }) {
   const handleChangeEmail = async e => {
      const form = new FormData(e.currentTarget)
      const email = form.get('email')

      try {
         const isValid = validateEmail(email)
         if (isValid) {
            const { error } = await authClient.changeEmail({
               newEmail: email,
               callbackURL: '/profile' // to redirect after verification
            })
            if (error) {
               toast.error('An Error Occurred', {
                  description: error
               })
            }
            toast.success('Approve email change', {
               description:
                  'We have send an email to your old email address click the linke to confirm. '
            })
         }
      } catch (err) {
         toast.error('An Error Occurred', {
            description: err
         })
      }
   }
   return (
      <form
         onSubmit={handleChangeEmail}
         className='p-5'
      >
         <Field>
            <FieldLegend>Update your Email</FieldLegend>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <div className='relative'>
               <Input
                  required
                  id='email'
                  type='email'
                  placeholder={session.user.email}
                  className='peer ps-9 rounded-xl'
               />
               <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <Mail
                     size={16}
                     aria-hidden='true'
                  />
               </div>
            </div>
            <FieldDescription>
               Enter a new Email for your hyper-chat account.
            </FieldDescription>
            <Button type='submit'>Save New Email</Button>
         </Field>
      </form>
   )
}
function PasswordOpration() {
   const handleChangePassword = async e => {
      const form = new FormData(e.currentTarget)
      const oldPassword = form.get('old-password')
      const newPassword = form.get('new-password')

      try {
         const isValid = validatePassWord(oldPassword, newPassword)
         if (isValid) {
            const { _, error } = await authClient.changePassword({
               newPassword: newPassword,
               currentPassword: oldPassword,
               revokeOtherSessions: true
            })
            if (error) {
               toast.error('An Error Occurred', {
                  description: error
               })
            }
            toast.success('Approve email change', {
               description:
                  'We have send an email to your old email address click the linke to confirm. '
            })
         }
      } catch (err) {
         toast.error('An Error Occurred', {
            description: err
         })
      }
   }

   return (
      <form
         onSubmit={handleChangePassword}
         className='p-5 overflow-scroll'
      >
         <Field>
            <FieldLegend className='mt-5'>Update your Password</FieldLegend>
            <FieldLabel htmlFor='old-password'>Old Password</FieldLabel>
            <div className='relative '>
               <Input
                  required
                  name='old-password'
                  id='old-password'
                  type='password'
                  placeholder='********'
                  className='peer ps-9 rounded-xl'
               />
               <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <Lock
                     size={16}
                     aria-hidden='true'
                  />
               </div>
            </div>
            <FieldDescription>
               Your old password with at least 1 uppercase lowercase number
               symbol included.
            </FieldDescription>
            <FieldLabel htmlFor='new-password'>New Password</FieldLabel>

            <PwInput
               name='new-password'
               id='new-password'
               placeholder='********'
            />
            <Button type='submit'>Save New Password</Button>
         </Field>
      </form>
   )
}
