'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
   const router = useRouter()
   const { data: session, isPending } = authClient.useSession()

   useEffect(() => {
      if (!isPending && !session?.user) {
         router.push('/sign-in')
      }
   }, [isPending, session, router])

   if (isPending)
      return <p className='text-center mt-8 text-white'>Loading...</p>
   if (!session?.user)
      return <p className='text-center mt-8 text-white'>Redirecting...</p>

   const { user } = session

   return (
      <main className='max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white'>
         <h1 className='text-2xl font-bold text-red-500'>Dashboard</h1>
         <p className='text-red-900'>Welcome, {user.name || 'User'}!</p>
         <p className='text-red-900'>Email: {user.email}</p>
         <p className='text-red-900'>job: {user.job}</p>
         <Link href='/'>
            <button
               onClick={() => authClient.signOut()}
               type='button'
               className='w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200'
            >
               Sign Out
            </button>
         </Link>
      </main>
   )
}
