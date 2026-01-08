'use client'

import { authClient } from '@/lib/auth-client'
import { useEffect } from 'react'

export default function Demo() {
   const { data: session, isPending } = authClient.useSession()

   if (isPending)
      return <p className='text-center mt-8 text-white'>Loading...</p>
   if (!session?.user)
      return <p className='text-center mt-8 text-white'>Redirecting...</p>

   const { user } = session

   return (
      <main className='h-screen flex items-center justify-center flex-col'>
         <h1 className='text-2xl'>Demo page</h1>
         <p className=''>Welcome, {user.job}!</p>
         <p className=''>Email: {user.email}</p>
      </main>
   )
}
