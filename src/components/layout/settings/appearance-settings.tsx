"use client";
import { Bitshow } from "@/components/font/font";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
//import { Switch } from "@/components/ui/switch";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
//import { Button } from "@/components/ui/button";
import { SunMoon } from "lucide-react";

export default function AppearanceSettings() {
  return (
    <div className="min-h-screen">
      <h1
        className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
      >
        Appearance
      </h1>
      <p className="text-muted-foreground text-xs text-center">
        Customize themes, dark mode, and visual preferences.
      </p>
      <form className="mt-5 p-3">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            General
          </h3>
          <Item>
            <ItemMedia className="flex justify-center items-center ">
              <SunMoon />
            </ItemMedia>
            <ItemContent className="flex">
              <ItemTitle>Theme</ItemTitle>
              <ItemDescription>Switch between different themes</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ThemeSwitcher />
            </ItemActions>
          </Item>
        </div>
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Chat
          </h3>
        </div>
      </form>
    </div>
  );
}
