'use client'

import { useState, useEffect, useCallback } from 'react'
import { SmoothTab } from '@/components/ui/smooth-tab'
import UserList from './user-list'
import { getAblyClient } from '@/lib/ably'
import { useSession } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw, Bug ,Box} from 'lucide-react'

export default function CategorizedChats() {
   const { data: session } = useSession()
   const [conversations, setConversations] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   const [showDebug, setShowDebug] = useState(false)
   const [rawData, setRawData] = useState<string>('')

   const fetchConversations = useCallback(async () => {
      if (!session?.user?.id) {
         setLoading(false)
         return
      }
      try {
         setError(null)
         const res = await fetch('/api/conversations')
         const text = await res.text()
         setRawData(text)
         if (!res.ok) throw new Error(`HTTP ${res.status}`)
         const data = JSON.parse(text)
         setConversations(data)
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
         setLoading(false)
      }
   }, [session?.user?.id])

   useEffect(() => {
      fetchConversations()
   }, [fetchConversations])

   useEffect(() => {
      const onFocus = () => fetchConversations()
      window.addEventListener('focus', onFocus)
      return () => window.removeEventListener('focus', onFocus)
   }, [fetchConversations])

   const userItems = conversations.map(c => ({
      id: c.id,
      name: c.otherUser?.name || 'Unknown',
      email: c.otherUser?.email || '',
      src: c.otherUser?.image || '/avatar.png',
      online: false,
      link: `/chats/${c.id}`,
      lastMsg: c.lastMessage?.content || 'No messages yet',
      unreadCount: c.unreadCount
   }))

   if (loading) {
      return (
         <div className='h-full w-full mb-16 space-y-2 p-4'>
            {Array.from({ length: 5 }).map((_, i) => (
               <Skeleton
                  key={i}
                  className='h-20 w-full rounded-xl'
               />
            ))}
            <SmoothTab
               items={[{ id: 'all', title: 'All' }]}
               value='all'
               onChange={() => {}}
            />
         </div>
      )
   }

   return (
      <div className='h-full w-full mb-16 relative'>
         {/**
       <Button
            variant='ghost'
            size='icon'
            className='fixed bottom-2 right-2 z-50'
            onClick={() => setShowDebug(!showDebug)}
         >
            <Bug className='h-4 w-4' />
         </Button>

         {showDebug && (
            <div className='fixed inset-0 z-40 bg-background/95 p-4 overflow-auto'>
               <div className='max-w-4xl mx-auto space-y-4'>
                  <h3 className='font-bold text-lg'>Debug Info</h3>

                  <div>
                     <h4 className='font-semibold'>Session User ID:</h4>
                     <pre className='bg-muted p-2 rounded text-xs overflow-auto'>
                        {session?.user?.id || 'No session'}
                     </pre>
                  </div>

                  <div>
                     <h4 className='font-semibold'>Raw API Response:</h4>
                     <pre className='bg-muted p-2 rounded text-xs overflow-auto max-h-40'>
                        {rawData || 'No data'}
                     </pre>
                  </div>

                  <div>
                     <h4 className='font-semibold'>
                        Parsed Conversations ({conversations.length}):
                     </h4>
                     <pre className='bg-muted p-2 rounded text-xs overflow-auto max-h-40'>
                        {JSON.stringify(conversations, null, 2)}
                     </pre>
                  </div>

                  <div>
                     <h4 className='font-semibold'>
                        Mapped User Items ({userItems.length}):
                     </h4>
                     <pre className='bg-muted p-2 rounded text-xs overflow-auto max-h-40'>
                        {JSON.stringify(userItems, null, 2)}
                     </pre>
                  </div>

                  {error && (
                     <div className='text-destructive'>Error: {error}</div>
                  )}

                  <div className='flex gap-2'>
                     <Button
                        onClick={fetchConversations}
                        size='sm'
                     >
                        <RefreshCw className='mr-2 h-3 w-3' />
                        Refetch
                     </Button>
                     <Button
                        onClick={() => setShowDebug(false)}
                        variant='outline'
                        size='sm'
                     >
                        Close
                     </Button>
                  </div>
               </div>
            </div>
         )}**/}

         {/* Main content */}
         {userItems.length === 0 ? (
            <div className='h-[90vh] flex flex-col items-center justify-center'>
            <Box className='w-24 h-24 bg-muted rounded-full mb-4' />
               <h2 className='text-2xl font-bold'>No Chat Yet.</h2>
               <p className='text-muted-foreground mb-4'>
                  This category doesn't contain any users.
               </p>
               <Button onClick={fetchConversations}>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Refresh
               </Button>
               {error && (
                  <p className='text-destructive text-sm mt-2'>{error}</p>
               )}
            </div>
         ) : (
            <UserList users={userItems} />
         )}

         <SmoothTab
            items={[{ id: 'all', title: 'All' }]}
            value='all'
            onChange={() => {}}
         />
      </div>
   )
}
