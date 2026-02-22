'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import ProfileView from '@/components/layout/user/profile-view'
import { Spinner } from '@/components/ui/spinner'

interface UserProfile {
   id: string
   name: string
   email: string
   avatar: string | null
   bio: string | null
   job: string | null
   country: string | null
}

export default function UserProfileClient({ username }: { username: string }) {
   const [user, setUser] = useState<UserProfile | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   const { data: session } = authClient.useSession()

   useEffect(() => {
      const fetchUser = async () => {
         try {
            setLoading(true)
            const res = await fetch(
               `/api/by-username?username=${encodeURIComponent(username)}`
            )
            if (!res.ok) {
               if (res.status === 404) setError('User not found')
               else setError('Failed to load profile')
               return
            }
            const data = await res.json()
            setUser(data)
         } catch {
            setError('An error occurred')
         } finally {
            setLoading(false)
         }
      }

      fetchUser()
   }, [username])

   if (loading) {
      return (
         <div className='flex items-center justify-center min-h-screen'>
            <Spinner />
         </div>
      )
   }

   if (error || !user) {
      return (
         <div className='flex items-center justify-center min-h-screen'>
            <p className='text-muted-foreground'>{error || 'User not found'}</p>
         </div>
      )
   }

   const isOwner = session?.user?.id === user.id

   return (
      <ProfileView
         user={user}
         isOwner={isOwner}
      />
   )
}
