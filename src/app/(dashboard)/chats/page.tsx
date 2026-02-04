import CategorizedChats from '@/components/layout/chat/user-list'
import { Spinner } from '@/components/ui/spinner'
import { Suspense } from 'react'
export default function DashboardPage() {
   return (
      <Suspense
         fallback={
            <div className='flex h-screen justify-center items-center'>
<Spinner className="size-8" />
            </div>
         }
      >
         <CategorizedChats />
      </Suspense>
   )
}
