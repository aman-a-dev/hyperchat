import React, { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'
import CategorizedChats from '@/components/layout/chat/categorized-chats' // ✅ correct import

export default function DashboardPage() {
   return (
      <Suspense
         fallback={
            <div className='flex h-screen justify-center items-center'>
               <Spinner className='size-8' />
            </div>
         }
      >
         <CategorizedChats />
      </Suspense>
   )
}
