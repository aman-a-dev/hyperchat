'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Spinner } from '@/components/ui/spinner'

import type { ReactNode } from 'react'

interface RedirectingProps {
   children: ReactNode
}

export default function Redirecting({ children }: RedirectingProps) {
   const { data: session, isPending } = authClient.useSession()

   const router = useRouter()
   const [isClient, setIsClient] = useState(false)

   useEffect(() => {
      setIsClient(true)
   }, [])

   useEffect(() => {
      if (!isPending && session === null) {
         router.push('/sign-up')
      }
   }, [session, isPending, router])

   // Show loading only on client and while checking auth
   if (!isClient || isPending) {
      return (
         <div className='w-full h-screen flex justify-center items-center flex-col'>
            <Spinner className='size-10' />
            <h1 className='text-2xl font-semibold m-5 text-center'>
               loading...
            </h1>
         </div>
      )
   }

   // If still no session, show loading (redirect in progress)
   if (!session?.user) {
      return (
         <div className='w-full h-screen flex justify-center items-center flex-col'>
            <Spinner className='size-10' />
            <h1 className='text-2xl font-semibold m-5 text-center'>
               Redirecting...
            </h1>
         </div>
      )
   }

   return children
}
