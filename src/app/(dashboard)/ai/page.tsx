import React from 'react'
import Link from 'next/link'
import { Brain } from 'lucide-react'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemDescription,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'

export default function Page() {
   return (
      <div className='flex flex-col gap-2 mt-18'>
         <div className='p-5 flex-col text-center gap-1 flex items-center justify-center'>
            <div className='relative'>
               <div className='absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/20 rounded-full blur-xl' />
               <div className='relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border backdrop-blur-sm'>
                  <Brain className='h-12 w-12 text-primary' />
               </div>
            </div>
            <h2 className='text-5xl font-bold tracking-tight mb-3'>AI</h2>
            <p className='text-muted-foreground mb-8'>
               Describe your ideal for profile picture summerize loge chat
               messages and a lot more 😃.
            </p>
         </div>
         <div>
            {aiServices.map(({ icon, title, href, description }) => (
               <Link
                  href={`/ai/${href}`}
                  key={title}
               >
                  <Item>
                     <ItemMedia>{icon}</ItemMedia>
                     <ItemContent>
                        <ItemTitle>{title}</ItemTitle>
                        <ItemDescription>{description}</ItemDescription>
                     </ItemContent>
                  </Item>
               </Link>
            ))}
         </div>
         <h2 className='text-2xl text-center font-bold text-muted-foreground tracking-tight mt-3'>
            More tools are in development
         </h2>
      </div>
   )
}

const aiServices = [
   {
      icon: '🤩',
      title: 'AI Profile Picture',
      href: '/profile',
      description:
         'Describe your ideal profile picture or upload a reference image. Choose from multiple styles to match your personality.'
   }
]
