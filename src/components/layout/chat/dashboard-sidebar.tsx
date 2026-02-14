'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarSeparator,
   SidebarGroup,
   useSidebar
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
   User,
   Settings,
   Palette,
   Bot,
   LogOut,
   MessageCircle,
   type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

type SidebarItemType = {
   title: string
   href: string
   icon: LucideIcon
   badge?: string
}

const sidebarItems: SidebarItemType[] = [
   { title: 'Chats', href: '/chats', icon: MessageCircle },
   { title: 'Profile', href: '/profile', icon: User },
   { title: 'Settings', href: '/settings', icon: Settings },
   { title: 'Appearance', href: '/settings/appearance', icon: Palette },
   { title: 'AI', href: '/ai', icon: Bot }
]

export default function DashboardSidebar() {
   const pathname = usePathname()
   const { toggleSidebar } = useSidebar()
   const isMobile = useIsMobile()
   const { data: session } = authClient.useSession()

   const handleSignOut = async () => {
      await authClient.signOut()
   }

   const handleLinkClick = () => {
      if (isMobile) {
         toggleSidebar()
      }
   }

   return (
      <Sidebar className='margin_top'>
         <SidebarHeader className='py-4 bg-background'>
            <div className='flex flex-col items-center gap-4'>
               <Avatar className='w-20 h-20 rounded-[30%/30%]'>
                  <AvatarImage
                     src={session?.user.image}
                     alt={session?.user.name}
                     className='w-20 h-20 rounded-[30%/30%]'
                  />
                  <AvatarFallback className='w-20 h-20 rounded-[30%/30%] text-lg'>
                     {session?.user.name.slice(0, 1)}
                  </AvatarFallback>
               </Avatar>
               <div className='text-center space-y-1'>
                  <h3 className='scroll-m-20 text-xl font-semibold tracking-tight'>
                     {session?.user.name}
                  </h3>
                  <p className='text-xs text-muted-foreground truncate max-w-[200px]'>
                     {session?.user.email}
                  </p>
               </div>
            </div>
         </SidebarHeader>

         <SidebarSeparator className='-ml-[0.9px]' />

         <SidebarContent className='bg-background'>
            <SidebarGroup className='px-2 py-4'>
               <nav className='space-y-1'>
                  {sidebarItems.map(item => {
                     const isActive = pathname.includes(item.href)

                     return (
                        <Link
                           key={item.href}
                           href={item.href}
                           onClick={handleLinkClick}
                           className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-muted-foreground hover:bg-red-500',
                              isActive && 'text-foreground'
                           )}
                        >
                           <item.icon className={cn('h-5 w-5')} />
                           <span>{item.title}</span>
                           {item.badge && (
                              <Badge className='ml-auto'>{item.badge}</Badge>
                           )}
                        </Link>
                     )
                  })}
               </nav>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter className='p-4 bg-background border-t border-sidebar-border'>
            <Button
               variant='outline'
               className='text-primary w-full justify-start gap-2'
               onClick={handleSignOut}
            >
               <LogOut className='h-4 w-4' />
               Log out
            </Button>
         </SidebarFooter>

         <style>
            {`
               @media (min-width: 768px) {
                  .margin_top {
                     margin-top: 56px;
                  }
               }
            `}
         </style>
      </Sidebar>
   )
}
