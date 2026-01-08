'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion, useReducedMotion } from 'framer-motion'
import { UploadCloud, Save } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { updateUserDataSettings } from '@/actions/settings'

export default function ProfileSettings() {
   const [bio, setBio] = useState<string>('')
   const [loading, setLoading] = useState<boolean>(false)
   const { data: session } = authClient.useSession()
   /*const session = {
      user: {
         name: 'Amanuel Antenh',
         email: 'amanuelantenha@gmail.com',
         image: '/avatar.png',
         bio: `Product Designer & Frontend Developer. Passionate about building beautiful, accessible user interfaces. Creating digital experiences that matter. ✨`,
         country: 'Ethiopia',
         job: 'dev'
      }
   }*/

   const shouldReduceMotion = useReducedMotion()

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)
      // 1. Create FormData from the submitted form element
      const formData = new FormData(e.currentTarget)

      // 2. Convert FormData to a plain object
      const rawData = {
         avatar: formData.get('avatar') as string,
         name: formData.get('name') as string,
         country: formData.get('country') as string,
         job: formData.get('job') as string,
         bio: formData.get('bio') as string,
         email: formData.get('email') as string
      }

      // 3. Filter out empty strings or nulls so only changed fields are sent
      // This ensures fields not filled in the form don't overwrite existing DB data
      const filteredData = Object.fromEntries(
         Object.entries(rawData).filter(
            ([_, value]) => value !== '' && value !== null
         )
      )

      try {
         // 4. Call your improved update function
         const updatedSettings = await updateUserDataSettings(filteredData)
         toast.success('Profile data updated successfuly', {
            description: updatedSettings
         })
         setLoading(false)
         // Optional: Show success toast or redirect
      } catch (error) {
         toast.error('An Error Occurred', {
            description: error
         })
         setLoading(false)
      }
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: false }}
         transition={{
            duration: 0.45,
            ease: shouldReduceMotion ? 'linear' : [0.16, 1, 0.3, 1]
         }}
         className='group w-full overflow-scroll border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative'
         aria-labelledby='glass-profile-settings-title'
      >
         <ProfileSettingsHeader />
         <form
            className='flex flex-col justify-between items-center'
            onSubmit={handleSubmit}
         >
            <div className='mb-3 w-full'>
               <div className='flex flex-col items-center gap-4 rounded border border-border/60 bg-background/40 p-6 backdrop-blur'>
                  <Avatar className='h-24 w-24 border border-border/60'>
                     <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                        className='object-cover'
                     />
                     <AvatarFallback className='text-2xl sm:text-4xl'>
                        {session.user.name.slice(0, 1)}
                     </AvatarFallback>
                  </Avatar>
                  <div className='text-center'>
                     <p className='text-sm font-medium text-foreground'>
                        {session.user.name}
                     </p>
                     <p className='text-xs text-muted-foreground'>
                        {session.user.job || 'job'}
                     </p>
                  </div>
                  <Button
                     type='button'
                     variant='outline'
                     className='rounded-xl  border-border/60 bg-white/5 px-4 py-2 text-sm text-foreground'
                  >
                     <Label htmlFor='avatar-upload'>
                        <UploadCloud className='mr-2 h-4 w-4' />
                        Update avatar
                     </Label>
                  </Button>
                  <Input
                     type='file'
                     name='avatar'
                     id='avatar-upload'
                     className='hidden'
                  />
               </div>
            </div>

            <div className='space-y-6 '>
               <div className='grid gap-4 '>
                  <div className='space-y-2'>
                     <Label htmlFor='profile-first-name'>Username</Label>
                     <Input
                        placeholder={session.user.name || ''}
                        className='h-11 rounded-2xl border-border/60 bg-background/60 px-4'
                        type='text'
                     />
                  </div>
               </div>

               <div className='grid gap-4 '>
                  <div className='space-y-2'>
                     <Label htmlFor='profile-email'>Email address</Label>
                     <Input
                        type='email'
                        placeholder={session.user.email || ''}
                        className='h-11 rounded-2xl border-border/60 bg-background/60 px-4'
                        autoComplete='email'
                     />
                  </div>
               </div>
               <div className='grid gap-4 '>
                  <div className='space-y-2'>
                     <Label htmlFor='profile-email'>Country</Label>
                     <Input
                        type='text'
                        placeholder={session.user.country || ''}
                        className='h-11 rounded-2xl border-border/60 bg-background/60 px-4'
                     />
                  </div>
               </div>
               <div className='grid gap-4 '>
                  <div className='space-y-2'>
                     <Label htmlFor='profile-email'>Job</Label>
                     <Input
                        type='text'
                        placeholder={session.user.job || ''}
                        className='h-11 rounded-2xl border-border/60 bg-background/60 px-4'
                     />
                  </div>
               </div>

               <div className='space-y-2'>
                  <Label htmlFor='profile-bio'>Bio</Label>
                  <Textarea
                     onChange={e => setBio(e.target.value)}
                     rows={4}
                     className='rounded-2xl border-border/60 bg-background/60 px-4 py-3 text-sm'
                     placeholder={session.user.bio || ''}
                  />
                  <p className='text-right text-xs text-muted-foreground'>
                     {bio.length}/150
                  </p>
                  {bio.length > 150 &&
                     toast.error('An Error Occurred', {
                        description: "Bio can't be more than 150 characters."
                     })}
               </div>

               <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
                  <Button
                     type='submit'
                     className='rounded-xl  bg-primary px-6 py-3 text-primary-foreground shadow-[0_20px_60px_-30px_rgba(79,70,229,0.75)] transition-transform duration-300 hover:-translate-y-1'
                     disabled={loading ? true : undefined}
                  >
                     {loading ? (
                        <>
                           <span>Updating...</span>
                           <Spinner />
                        </>
                     ) : (
                        <>
                           <span>Save profile data</span>
                           <Save className='h-4 w-4' />
                        </>
                     )}
                  </Button>
               </div>
            </div>
         </form>
      </motion.div>
   )
}

function ProfileSettingsHeader() {
   return (
      <>
         <div
            aria-hidden='true'
            className='absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10'
         />
         <div className='mb-10 flex flex-col gap-4 flex-row sm:items-center sm:justify-between'>
            <div>
               <h1
                  id='glass-profile-settings-title'
                  className='mt-3 text-2xl font-semibold text-foreground sm:text-3xl'
               >
                  Profile settings
               </h1>
               <p className='mt-2 text-sm text-muted-foreground'>
                  Update your avatar, personal details, and notification
                  preferences.
               </p>
            </div>
         </div>
      </>
   )
}
