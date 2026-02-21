"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import ChatSearchBar from "@/components/ui/action-search-bar.tsx";
import { useState, useCallback, type ChangeEvent } from "react";
export default function DashboardNav() {
  const pathname = usePathname();
  const [query, setQuery] = useState('')
  const handleSearchOpen = () => {
    console.log("Search bar opened!");
    // You can do something like log event, focus, or open a sidebar
  };
  

  return (
    <>
      <div
        className={`${
          /\/chats\/[0-9|a-z|A-Z]/.test(pathname) && "hidden"
        } fixed h-14 top-0 right-0 left-0 flex items-center justify-between p-3 px-5 gap-2 z-10 bg-background/50 backdrop-blur-md border border-b border-sidebar-background`}
      >
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <Separator orientation="vertical" />
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight md:text-right">
            {pathname.replace(/\//, "").toUpperCase()}
          </h3>
        </div>
        {pathname === "/chats" && (
          <ChatSearchBar
            onOpen={handleSearchOpen}
            query={query}
            setQuery={setQuery}
          />
        )}
      </div>
    </>
  );
}
