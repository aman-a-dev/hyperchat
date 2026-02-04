import { SidebarProvider } from "@/components/providers/providers";
import DashboardNav from "@/components/layout/chat/dashboard-nav";
import DashboardSidebar from "@/components/layout/chat/dashboard-sidebar";

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <DashboardNav />
      <div className="margin_left">{children}</div>
      <style>
        {`
         @media (min-width: 768px) {
  .margin_left{
   margin-left: 16rem;}
}

         `}
      </style>
    </SidebarProvider>
  );
}
