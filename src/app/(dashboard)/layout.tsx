import { SidebarProvider } from '@/components/providers/providers'
import DashboardNav from '@/components/layout/chat/dashboard-nav'
import DashboardSidebar from '@/components/layout/chat/dashboard-sidebar'
import Redirecting from '@/components/layout/auth/redirecting'

export default function DashboardRootLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <SidebarProvider>
         <DashboardSidebar />
         <DashboardNav />
            <div className='md:ml-[16rem]'>
         <Redirecting>
            {children}
         </Redirecting>
            </div>
      </SidebarProvider>
   )
}
