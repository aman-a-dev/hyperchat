'use client'
import ChatSearchBar from '@/components/ui/action-search-bar.tsx'
export default function page() {
   const handleSearchOpen = () => {
      console.log('Search bar opened!')
      // You can do something like log event, focus, or open a sidebar
   }

   return (
      <div className='p-6'>
         <ChatSearchBar
            onOpen={handleSearchOpen}
            triggerIcon={<span>🔍</span>}
         />
      </div>
   )
}
