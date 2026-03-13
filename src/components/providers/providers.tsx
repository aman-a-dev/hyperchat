"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { SidebarProvider as SidebarProviders } from "@/components/ui/sidebar";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function SidebarProvider({
  children,
  ...props
}: React.ComponentProps<typeof SidebarProviders>) {
  return <SidebarProviders {...props}>{children}</SidebarProviders>;
}
