'use client'

import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import type { JSX } from 'react'
import { useSyncExternalStore, useRef, useState } from 'react'
import { ThemeToggleButton } from '@/components/shared/theme-toggler-button'
import { cn } from '@/lib/utils'

function ThemeOption({
   icon,
   value,
   isActive,
   onClick
}: {
   icon: JSX.Element
   value: string
   isActive?: boolean
   onClick: (value: string) => void
}) {
   return (
      <button
         className={cn(
            'relative flex size-8 cursor-default items-center justify-center rounded-full transition-[color] [&_svg]:size-4',
            isActive
               ? 'text-zinc-950 dark:text-zinc-50'
               : 'text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50'
         )}
         role='radio'
         aria-checked={isActive}
         aria-label={`Switch to ${value} theme`}
         onClick={() => onClick(value)}
         type='button'
      >
         {icon}
         {isActive && (
            <motion.div
               layoutId='theme-option'
               transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
               className='absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700'
            />
         )}
      </button>
   )
}

const THEME_OPTIONS = [
   /*{
      icon: <MonitorIcon />,
      value: 'system'
   },*/
   {
      icon: <SunIcon />,
      value: 'light'
   },
   {
      icon: <MoonStarIcon />,
      value: 'dark'
   }
]

function ThemeSwitcher() {
   const { theme, setTheme } = useTheme()
   const [variant, setVariant] = useState(
      randomVariant())
   const toggleButtonRef = useRef<HTMLButtonElement>(null)

   const isMounted = useSyncExternalStore(
      () => () => {},
      () => true,
      () => false
   )

   const handleThemeOptionClick = (value: string) => {
      // Trigger the hidden ThemeToggleButton instead of setTheme directly
      if (toggleButtonRef.current) {
         // Simulate click on hidden toggle button
         toggleButtonRef.current.click()
         setVariant(randomVariant())
      }
   }

   if (!isMounted) {
      return <div className='flex h-8 w-24' />
   }

   return (
      <div className='inline-flex items-center gap-1'>
         {/* Visible animated switcher - handles visual feedback only */}
         <motion.div
            key={String(isMounted)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700'
            role='radiogroup'
         >
            {THEME_OPTIONS.map(option => (
               <ThemeOption
                  key={option.value}
                  icon={option.icon}
                  value={option.value}
                  isActive={theme === option.value}
                  onClick={handleThemeOptionClick}
               />
            ))}
         </motion.div>

         {/* Hidden ThemeToggleButton that actually controls the theme */}
         <ThemeToggleButton
            ref={toggleButtonRef}
            className='hidden' // Screen reader only - completely hidden visually
            aria-hidden='true'
            variant={variant}
         />
      </div>
   )
}

export { ThemeSwitcher }

function randomVariant() {
   const randomNum = Math.floor(Math.random() * 4) + 1
   if (randomNum === 1) {
      return 'circle-blur'
   }
   if (randomNum === 2) {
      return 'polygon'
   }
   if (randomNum === 3) {
      return 'rectangle'
   }
   if (randomNum === 4) {
      return 'circle'
   }
}
// auth
import { betterAuth } from 'better-auth'
// orm
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
// plugins
import { customSession } from 'better-auth/plugins'
// email
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.BETTER_AUTH_EMAIL || 'delivered@resend.dev'
const to = process.env.TEST_EMAIL || ''

export const auth = betterAuth({
   appName: 'Hyperchat',
   baseURL: process.env.BETTER_AUTH_URL,
   database: prismaAdapter(prisma, {
      provider: 'mysql'
   }),
   account: {
      accountLinking: {
         trustedProviders: ['google']
      }
   },
   emailAndPassword: {
      enabled: true,
      //requireEmailVerification: true,
      //sendOnSignUp: true,
      async sendResetPassword({ user, url }) {
         await resend.emails.send({
            from: from,
            to: user.email,
            subject: 'Reset your password',
            html: `<a href=${url}>Reset your password</a>`
         })
      }
   },
   socialProviders: {
      google: {
         clientId: process.env.AUTH_GOOGLE_CLIENT_ID || '',
         clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET || ''
      }
   },
   advanced: {
      cookiePrefix: 'hyper-chat'
   },
   user: {
      deleteUser: {
         enabled: true
      },
      
      changeEmail: {
  enabled: true,
  sendChangeEmailConfirmation: async (
    { user, newEmail, url, token },
    request
  ) => {
    await resend.emails.send({
      from,
      to: user.email,
      subject: "Approve email change",
      text: `Click the link to approve the change to ${newEmail}: ${url}`,
    });
  },
},
      deleteUser: {
         enabled: true,
         sendDeleteAccountVerification: async (
            { user, url, token },
            request
         ) => {
            const { error } = await resend.emails.send({
               from: from,

               to: user.email,
               subject: 'Delete Hyperchat account',
               html: `
        <div style="display:flex;justify-content:center;text-align:center;flex-direction: column;align-items:center">
          <h1 style="font-weight: bold;color: #cab300;">Delete Hyper-Chat Account ️🗑</h1>
          <p>Please click the link below 👇 to confirm Delete Account</p>
          <a href="${url}" style="background-color:#FFD700;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;max-width: 300px;">Verify my Email</a>
          <p><b>${user.email}</b> Delete my account</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        `
            })
         }
      },
      additionalFields: {
         bio: {
            type: 'string',
            required: false,
            input: false
         },
         job: {
            type: 'string',
            required: false,
            input: false
         },
         country: {
            type: 'string',
            required: false,
            input: false
         }
      },
      emailVerification: {
         sendVerificationEmail: async ({ user, url }) => {
            const { error } = await resend.emails.send({
                           from: from,

               to: user.email,
               subject: 'Verify your email address',
               html: `
        <div style="display:flex;justify-content:center;text-align:center;flex-direction: column;align-items:center">
          <h1 style="font-weight: bold;color: #cab300;">Welcome to Hyper-Chat ✋️</h1>
          <p>Please click the link below 👇 to verify your email address:</p>
          <a href="${url}" style="background-color:#FFD700;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;max-width: 300px;">Verify my Email</a>
          <p><b>${user.email}</b> is going  to verify</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        `
            })

            if (error) {
               console.error('‼️ Failed to send verification email:', error)
            }
         }
      }
   },
   plugins: [
      customSession(async ({ user, session }) => {
         return {
            user: {
               ...user,
               bio: user.bio,
               job: user.job,
               country: user.country
            },
            session
         }
      })
   ]
})

import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function getSession(req?: NextRequest) {
   try {
      // If we have a request object (in API routes), use its headers
      const headersList = req ? req.headers : await headers()
      const session = await auth.api.getSession({
         headers: headersList
      })
      return session
   } catch (error: any) {
      console.error('Failed to get session:', error)
      return null
   }
}
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

export function SidebarProvider({ children, ...props }: React.ComponentProps) {
  return <SidebarProviders {...props}>{children}</SidebarProviders>;
}
import Link from "next/link";
import {
  ChevronRightIcon,
  User,
  Palette,
  ShieldCheck,
  LayoutGrid,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Bitshow } from "@/components/font/font";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function Settings() {
  return (
    <div>
      <h1
        className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
      >
        Settings
      </h1>
      <p className="text-muted-foreground text-xs text-center">
        Customize, Control and Adjust your Settings.
      </p>
      <div className="mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 justify-center">
        {settingsList.map((setting) => (
          <Link key={crypto.randomUUID()} href={`/settings/${setting.href}`}>
            <Item variant="outline">
              <ItemMedia>{setting.icon}</ItemMedia>
              <ItemContent>
                <ItemTitle>{setting.title}</ItemTitle>
                <ItemDescription>{setting.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon />
              </ItemActions>
            </Item>
          </Link>
        ))}
      </div>
    </div>
  );
}
type settingsListType = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const settingsList: settingsListType[] = [
  {
    icon: <User size={20} />,
    title: "Account",
    description: "Update your personal details, email, and profile picture.",
    href: "account",
  },
  {
    icon: <Palette size={20} />,
    title: "Appearance",
    description: "Customize themes, dark mode, and visual preferences.",
    href: "appearance",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Privacy",
    description: "Manage your visibility, online status, and data sharing.",
    href: "privacy",
  },
  {
    icon: <LayoutGrid size={20} />,
    title: "Categories",
    description: "Organize your chats into custom folders or groups.",
    href: "catagory",
  },
  {
    icon: <Trash2 size={20} className="text-red-500" />,
    title: "Danger Zone",
    description: "Permanently delete your account or wipe sensitive data.",
    href: "dangerous",
  },
];
'use client'

import { useState, useEffect } from 'react'
import { Bitshow } from '@/components/font/font'
import {
   ArrowDownUp,
   Clock8,
   BadgeInfo,
   Earth,
   Building,
   Mail,
   Loader2
} from 'lucide-react'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemDescription,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'
import {
   AccordionMultiselect,
   AccordionMultiselectItem,
   AccordionMultiselectTrigger,
   AccordionMultiselectContent,
   AccordionMultiselectOption
} from '@/components/ui/accordion-multiselect'
import { Checkbox } from '@/components/ui/checkbox2'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton' // shadcn skeleton
import { toast } from 'sonner' // sonner toast

interface PrivacySettings {
   onlineStatus: boolean
   lastSeen: boolean
   showBio: boolean
   showJob: boolean
   showCountry: boolean
   syncEmails: boolean
   allowSearch: boolean
}

export default function PrivacySetting() {
   const [settings, setSettings] = useState<PrivacySettings>({
      onlineStatus: true,
      lastSeen: false,
      showBio: true,
      showJob: false,
      showCountry: true,
      syncEmails: false,
      allowSearch: true
   })

   const [loading, setLoading] = useState(false)
   const [initialLoading, setInitialLoading] = useState(true)
   const [hasChanges, setHasChanges] = useState(false)

   // Fetch existing settings on mount
   useEffect(() => {
      const fetchSettings = async () => {
         try {
            const response = await fetch('/api/privacy-settings')

            if (!response.ok) {
               let errorText = 'Failed to fetch privacy settings'
               try {
                  const errorData = await response.json()
                  errorText = errorData.error || errorText
               } catch {
                  errorText = response.statusText || errorText
               }
               throw new Error(`${errorText} (Status: ${response.status})`)
            }

            const data = await response.json()
            if (data.data) {
               setSettings(data.data)
            }
         } catch (error: any)  {
            console.error('Error fetching settings:', error)
            toast.error(
               error instanceof Error
                  ? error.message
                  : 'Failed to load privacy settings'
            )
         } finally {
            setInitialLoading(false)
         }
      }

      fetchSettings()
   }, [])

   const handleSettingChange = (key: keyof PrivacySettings, value: boolean) => {
      setSettings(prev => ({
         ...prev,
         [key]: value
      }))
      setHasChanges(true)
   }

   const handleSaveChanges = async () => {
      setLoading(true)

      try {
         const response = await fetch('/api/privacy-settings', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               onlineStatus: settings.onlineStatus,
               lastSeen: settings.lastSeen,
               showBio: settings.showBio,
               showJob: settings.showJob,
               showCountry: settings.showCountry,
               syncEmails: settings.syncEmails,
               allowSearch: settings.allowSearch
            })
         })

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(
               errorData.error || `Failed to save (Status: ${response.status})`
            )
         }

         const data = await response.json()
         toast.success('Privacy settings saved successfully!')
         setHasChanges(false)

         console.log('Settings saved:', data)
      } catch (error: any)  {
         toast.error(
            error instanceof Error
               ? error.message
               : 'An error occurred while saving settings'
         )
         console.error('Error saving settings:', error)
      } finally {
         setLoading(false)
      }
   }

   if (initialLoading) {
      return (
         <div className='min-h-screen flex flex-col w-full gap-1'>
            <Skeleton className='h-8 w-3/4 mx-auto mt-5 mb-3' />
            <Skeleton className='h-4 w-1/2 mx-auto mb-5' />
            <div className='gap-2 md:grid-2 md:pace-x-2 space-y-2'>
               <Skeleton className='h-12 w-full' />
               <Skeleton className='h-12 w-full' />
               <Skeleton className='h-12 w-full' />
               <Skeleton className='h-12 w-full' />
               <Skeleton className='h-12 w-full' />
               <Skeleton className='h-12 w-full' />
               <Skeleton className='h-12 w-full' />
            </div>
         </div>
      )
   }

   return (
      <div className='min-h-[200vh]'>
         <h1
            className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
         >
            Privacy
         </h1>
         <p className='text-muted-foreground text-xs text-center'>
            Manage your visibility, online status, and data sharing.
         </p>

         <div className='mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 md:items-start'>
            <AccordionMultiselect className='px-3'>
               {/* Online Status */}
               <AccordionMultiselectItem value='item-1'>
                  <AccordionMultiselectTrigger>
                     <div className='flex gap-3'>
                        <ArrowDownUp />
                        <div className='flex flex-col justify-start items-start ml-2'>
                           <h3 className='scroll-m-20 text-md font-semibold tracking-tight'>
                              Online Status
                           </h3>
                           <p className='text-muted-foreground text-sm'>
                              Whether to show your online status.
                           </p>
                        </div>
                     </div>
                  </AccordionMultiselectTrigger>
                  <AccordionMultiselectContent className='pl-9 space-y-1.5'>
                     <AccordionMultiselectOption>
                        <div className='flex gap-3 p-3 leading-none'>
                           <Checkbox
                              id='online'
                              checked={settings.onlineStatus}
                              onCheckedChange={checked =>
                                 handleSettingChange(
                                    'onlineStatus',
                                    checked as boolean
                                 )
                              }
                           />
                           <Label
                              htmlFor='online'
                              className='text-muted-foreground text-sm font-semibold p-0 m-0 cursor-pointer'
                           >
                              Whether to show you are online or offline in
                              real-time.
                           </Label>
                        </div>
                     </AccordionMultiselectOption>
                  </AccordionMultiselectContent>
               </AccordionMultiselectItem>

               {/* Last Seen */}
               <AccordionMultiselectItem value='item-2'>
                  <AccordionMultiselectTrigger>
                     <div className='flex gap-3'>
                        <Clock8 />
                        <div className='flex flex-col justify-start items-start ml-2'>
                           <h3 className='scroll-m-20 text-md font-semibold tracking-tight'>
                              Last Seen
                           </h3>
                           <p className='text-muted-foreground text-sm'>
                              Your last online time.
                           </p>
                        </div>
                     </div>
                  </AccordionMultiselectTrigger>
                  <AccordionMultiselectContent className='pl-9 space-y-1.5'>
                     <AccordionMultiselectOption>
                        <div className='flex gap-3 p-3 leading-none'>
                           <Checkbox
                              id='lastseen'
                              checked={settings.lastSeen}
                              onCheckedChange={checked =>
                                 handleSettingChange(
                                    'lastSeen',
                                    checked as boolean
                                 )
                              }
                           />
                           <Label
                              htmlFor='lastseen'
                              className='text-muted-foreground text-sm font-semibold p-0 m-0 cursor-pointer'
                           >
                              Whether to show your timestamp in real-time.
                           </Label>
                        </div>
                     </AccordionMultiselectOption>
                  </AccordionMultiselectContent>
               </AccordionMultiselectItem>

               {/* Bio */}
               <AccordionMultiselectItem value='item-3'>
                  <AccordionMultiselectTrigger>
                     <div className='flex gap-3'>
                        <BadgeInfo />
                        <div className='flex flex-col justify-start items-start ml-2'>
                           <h3 className='scroll-m-20 text-md font-semibold tracking-tight'>
                              Bio
                           </h3>
                           <p className='text-muted-foreground text-sm'>
                              Whether to show your bio.
                           </p>
                        </div>
                     </div>
                  </AccordionMultiselectTrigger>
                  <AccordionMultiselectContent className='pl-9 space-y-1.5'>
                     <AccordionMultiselectOption>
                        <div className='flex gap-3 p-3 leading-none'>
                           <Checkbox
                              id='bio'
                              checked={settings.showBio}
                              onCheckedChange={checked =>
                                 handleSettingChange(
                                    'showBio',
                                    checked as boolean
                                 )
                              }
                           />
                           <Label
                              htmlFor='bio'
                              className='text-muted-foreground text-sm font-semibold p-0 m-0 cursor-pointer'
                           >
                              Whether to display your bio publicly.
                           </Label>
                        </div>
                     </AccordionMultiselectOption>
                  </AccordionMultiselectContent>
               </AccordionMultiselectItem>

               {/* Job */}
               <AccordionMultiselectItem value='item-4'>
                  <AccordionMultiselectTrigger>
                     <div className='flex gap-3'>
                        <Building />
                        <div className='flex flex-col justify-start items-start ml-2'>
                           <h3 className='scroll-m-20 text-md font-semibold tracking-tight'>
                              Job
                           </h3>
                           <p className='text-muted-foreground text-sm'>
                              Whether to show your job.
                           </p>
                        </div>
                     </div>
                  </AccordionMultiselectTrigger>
                  <AccordionMultiselectContent className='pl-9 space-y-1.5'>
                     <AccordionMultiselectOption>
                        <div className='flex gap-3 p-3 leading-none'>
                           <Checkbox
                              id='job'
                              checked={settings.showJob}
                              onCheckedChange={checked =>
                                 handleSettingChange(
                                    'showJob',
                                    checked as boolean
                                 )
                              }
                           />
                           <Label
                              htmlFor='job'
                              className='text-muted-foreground text-sm font-semibold p-0 m-0 cursor-pointer'
                           >
                              Whether to display your job information publicly.
                           </Label>
                        </div>
                     </AccordionMultiselectOption>
                  </AccordionMultiselectContent>
               </AccordionMultiselectItem>

               {/* Country */}
               <AccordionMultiselectItem value='item-5'>
                  <AccordionMultiselectTrigger>
                     <div className='flex gap-3'>
                        <Earth />
                        <div className='flex flex-col justify-start items-start ml-2'>
                           <h3 className='scroll-m-20 text-md font-semibold tracking-tight'>
                              Country
                           </h3>
                           <p className='text-muted-foreground text-sm'>
                              Whether to show your country.
                           </p>
                        </div>
                     </div>
                  </AccordionMultiselectTrigger>
                  <AccordionMultiselectContent className='pl-9 space-y-1.5'>
                     <AccordionMultiselectOption>
                        <div className='flex gap-3 p-3 leading-none'>
                           <Checkbox
                              id='country'
                              checked={settings.showCountry}
                              onCheckedChange={checked =>
                                 handleSettingChange(
                                    'showCountry',
                                    checked as boolean
                                 )
                              }
                           />
                           <Label
                              htmlFor='country'
                              className='text-muted-foreground text-sm font-semibold p-0 m-0 cursor-pointer'
                           >
                              Whether to display your country publicly.
                           </Label>
                        </div>
                     </AccordionMultiselectOption>
                  </AccordionMultiselectContent>
               </AccordionMultiselectItem>
            </AccordionMultiselect>

            {/* Email Sync */}
            <Item>
               <ItemMedia>
                  <Mail />
               </ItemMedia>
               <ItemContent>
                  <ItemTitle>Emails</ItemTitle>
                  <ItemDescription>
                     Sync emails from your Gmail account.
                  </ItemDescription>
               </ItemContent>
               <ItemActions>
                  <Switch
                     checked={settings.syncEmails}
                     onCheckedChange={checked =>
                        handleSettingChange('syncEmails', checked)
                     }
                  />
               </ItemActions>
            </Item>

            {/* Search ability */}
            <Item>
               <ItemMedia>
                  <Mail />
               </ItemMedia>
               <ItemContent>
                  <ItemTitle>Search</ItemTitle>
                  <ItemDescription>To appear when searching</ItemDescription>
               </ItemContent>
               <ItemActions>
                  <Switch
                     checked={settings.allowSearch}
                     onCheckedChange={checked =>
                        handleSettingChange('allowSearch', checked)
                     }
                  />
               </ItemActions>
            </Item>
         </div>

         {/* Save Button */}
         <div className='mt-8 mb-8 flex justify-center px-4'>
            <Button
               onClick={handleSaveChanges}
               disabled={loading || !hasChanges}
               className='w-full md:w-64 py-6 text-base font-semibold'
            >
               {loading ? (
                  <>
                     <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                     <span>Saving...</span>
                  </>
               ) : (
                  `Save Changes${hasChanges ? ' * ' : ''}`
               )}
            </Button>
         </div>
      </div>
   )
}
'use client'
import { Bitshow } from '@/components/font/font'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import {
   Dialog,
   DialogContent,
   DialogTrigger,
   DialogTitle,
   DialogClose
} from '@/components/ui/dialog2'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'
import {
   Popover,
   PopoverContent,
   PopoverTrigger
} from '@/components/ui/popover'
import {
   Plus,
   Save,
   Folder,
   ChevronsUpDown,
   EllipsisVertical,
   Edit,
   Trash,
   Check
} from 'lucide-react'
import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput
} from '@/components/ui/input-group'
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetTitle,
   SheetTrigger,
   SheetHeader
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { useRef } from 'react'
import { validateCatagoryName } from '@/actions/validation'

export default function CatagorySettings() {
   const closeDialogRef = useRef<HTMLButtonElement | null>(null)
   const handleCreatCatagory = (e: ClickEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const catagoryName = formData.get('catagory-name') as string
      const isValid = validateCatagoryName(catagoryName)
      if (isValid) {
         closeDialogRef.current.click()
      }
   }
   const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

   const handleSelectedChange = (ids: string[]) => {
      setSelectedUserIds(ids)
   }
   return (
      <div>
         <h1
            className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
         >
            Catagory
         </h1>
         <p className='text-muted-foreground text-xs text-center'>
            Categoriz your chats in to organised folders.
         </p>
         <div className='mt-5 p-2 flex flex-col gap-2 justify-center'>
            <Dialog>
               <DialogTrigger asChild>
                  <Button className='md:w-3xl md:mx-auto'>
                     <span>Add Catagory</span>
                     <Plus />
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <form
                     className='flex flex-col gap-4 items-center'
                     onSubmit={handleCreatCatagory}
                  >
                     <DialogClose
                        ref={closeDialogRef}
                        className='sr-only'
                     >
                        Close Dialog
                     </DialogClose>
                     <div className='flex flex-col gap-2 items-center'>
                        <Folder className='size-15' />
                        <DialogTitle className='text-3xl'>Catagory</DialogTitle>
                     </div>
                     <div className='flex flex-col gap-2 w-full'>
                        <Label
                           htmlFor='catagory-input'
                           className='sr-only'
                        >
                           Catagory Name
                        </Label>
                        <InputGroup>
                           <InputGroupInput
                              id='catagory-input'
                              placeholder='Catagory Name___'
                              //required
                              name='catagory-name'
                           />
                           <InputGroupAddon align='inline-end'>
                              <Sheet>
                                 <SheetTrigger asChild>
                                    <Button
                                       variant='ghost'
                                       size='icon'
                                       className='rounded-[30%/30%]'
                                       type='button'
                                    >
                                       <Plus />
                                    </Button>
                                 </SheetTrigger>
                                 <SheetContent className='overflow-y-scroll'>
                                    <SheetHeader>
                                       <SheetTitle>Choose A Member</SheetTitle>
                                       <SheetDescription>
                                          Choose a member for your catagory.
                                       </SheetDescription>
                                       <MemberOptionList
                                          onSelectedChange={
                                             handleSelectedChange
                                          }
                                       />
                                    </SheetHeader>
                                 </SheetContent>
                              </Sheet>
                           </InputGroupAddon>
                        </InputGroup>
                        <Button>
                           <span>Create</span>
                           <Save />
                        </Button>
                     </div>
                  </form>
               </DialogContent>
            </Dialog>
            <div className='flex flex-col gap-2 md:grid md:grid-cols-2 justify-center gap-2 my-3'>
               {catagorys.map(({ id, name, _index }) => (
                  <Item
                     variant='outline'
                     size='sm'
                     key={id}
                  >
                     <Popover>
                        <PopoverTrigger>
                           <ItemMedia>
                              <EllipsisVertical />
                           </ItemMedia>
                        </PopoverTrigger>
                        <PopoverContent className='flex flex-col gap-1 text-start p-1 ml-5 w-max'>
                           <Button
                              variant='outline'
                              className='flex justify-start items-center'
                           >
                              <Edit />
                              <span>Edit</span>
                           </Button>
                           <Button
                              variant='outline'
                              className='text-primary'
                           >
                              <Trash />
                              <span>Delete</span>
                           </Button>
                        </PopoverContent>
                     </Popover>
                     <ItemContent>
                        <ItemTitle>{name}</ItemTitle>
                     </ItemContent>
                     <ItemActions>
                        <ChevronsUpDown className='size-4' />
                     </ItemActions>
                  </Item>
               ))}
            </div>
         </div>
      </div>
   )
}

const catagorys = [
   { id: crypto.randomUUID(), name: 'Friends 👬', index: 1 },
   { id: crypto.randomUUID(), name: 'Dev 💻', index: 2 },
   { id: crypto.randomUUID(), name: 'Family 👨‍👧‍👧', index: 4 }
]

function MemberOptionList({
   onSelectedChange
}: {
   onSelectedChange?: (ids: string[]) => void
}) {
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

   const toggleSelection = (id: string) => {
      const next = new Set(selectedIds)
      if (next.has(id)) {
         next.delete(id)
      } else {
         next.add(id)
      }
      setSelectedIds(next)

      // Convert to array and notify parent
      onSelectedChange?.(Array.from(next))
   }

   return (
      <div className='grid grid-cols-4 py-10'>
         {contacts.map(contact => (
            <div
               key={contact.id}
               className='flex justify-center items-center flex-col gap-2 cursor-pointer'
               onClick={() => toggleSelection(contact.id)}
            >
               <div
                  className={`relative rounded-[30%/30%] ${
                     selectedIds.has(contact.id) ? 'ring-2 ring-primary' : ''
                  }`}
               >
                  <Avatar className='rounded-[30%/30%]'>
                     <AvatarImage src={contact.src} />
                     <AvatarFallback className='rounded-[30%/30%]'>
                        {contact.name.slice(0, 2).toUpperCase()}
                     </AvatarFallback>
                  </Avatar>
                  {selectedIds.has(contact.id) && (
                     <div className='absolute -top-3 -right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs'>
                        ✓
                     </div>
                  )}
               </div>

               <h3 className='text-muted-foreground text-xs md:text-sm'>
                  {`${contact.name.slice(0, 3)}...`}
               </h3>
            </div>
         ))}
      </div>
   )
}
export const contacts = [
   {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      src: '/avatar1.png',
      online: true,
      link: '/chats/1'
   },
   {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      src: '/avatar2.png',
      online: false,
      link: '/chats/2'
   },
   {
      id: '3',
      name: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      src: '/avatar3.png',
      online: true,
      link: '/chats/3'
   },
   {
      id: '4',
      name: 'Diana Evans',
      email: 'diana.evans@example.com',
      src: '/avatar.png',
      online: false,
      link: '/chats/4'
   },
   {
      id: '5',
      name: 'Ethan Brown',
      email: 'ethan.brown@example.com',
      src: '/avatar5.png',
      online: true,
      link: '/chats/5'
   },
   {
      id: '6',
      name: 'Fatima Noor',
      email: 'fatima.noor@example.com',
      src: '/avatar6.png',
      online: true,
      link: '/chats/6'
   },
   {
      id: '7',
      name: 'George Miller',
      email: 'george.miller@example.com',
      src: '/avatar7.png',
      online: false,
      link: '/chats/7'
   },
   {
      id: '8',
      name: 'Hannah Lee',
      email: 'hannah.lee@example.com',
      src: '/avatar8.png',
      online: true,
      link: '/chats/8'
   },
   {
      id: '9',
      name: 'Isaac Kim',
      email: 'isaac.kim@example.com',
      src: '/avatar9.png',
      online: false,
      link: '/chats/9'
   },
   {
      id: '10',
      name: 'Julia Roberts',
      email: 'julia.roberts@example.com',
      src: '/avatar.png',
      online: true,
      link: '/chats/10'
   },

   {
      id: '11',
      name: 'Kevin Parker',
      email: 'kevin.parker@example.com',
      src: '/avatar11.png',
      online: false,
      link: '/chats/11'
   },
   {
      id: '12',
      name: 'Lina Ahmed',
      email: 'lina.ahmed@example.com',
      src: '/avatar12.png',
      online: true,
      link: '/chats/12'
   },
   {
      id: '13',
      name: 'Michael Scott',
      email: 'michael.scott@example.com',
      src: '/avatar13.png',
      online: false,
      link: '/chats/13'
   },
   {
      id: '14',
      name: 'Nina Patel',
      email: 'nina.patel@example.com',
      src: '/avatar14.png',
      online: true,
      link: '/chats/14'
   },
   {
      id: '15',
      name: 'Oscar White',
      email: 'oscar.white@example.com',
      src: '/avatar15.png',
      online: false,
      link: '/chats/15'
   },
   {
      id: '16',
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      src: '/avatar16.png',
      online: true,
      link: '/chats/16'
   },
   {
      id: '17',
      name: 'Quentin Moore',
      email: 'quentin.moore@example.com',
      src: '/avatar17.png',
      online: false,
      link: '/chats/17'
   },
   {
      id: '18',
      name: 'Rania Khalid',
      email: 'rania.khalid@example.com',
      src: '/avatar18.png',
      online: true,
      link: '/chats/18'
   },
   {
      id: '19',
      name: 'Samuel Green',
      email: 'samuel.green@example.com',
      src: '/avatar.png',
      online: false,
      link: '/chats/19'
   },
   {
      id: '20',
      name: 'Tina Lopez',
      email: 'tina.lopez@example.com',
      src: '/avatar20.png',
      online: true,
      link: '/chats/20'
   },

   {
      id: '21',
      name: 'Umar Farooq',
      email: 'umar.farooq@example.com',
      src: '/avatar21.png',
      online: true,
      link: '/chats/21'
   },
   {
      id: '22',
      name: 'Victoria Hall',
      email: 'victoria.hall@example.com',
      src: '/avatar22.png',
      online: false,
      link: '/chats/22'
   },
   {
      id: '23',
      name: 'William Turner',
      email: 'william.turner@example.com',
      src: '/avatar23.png',
      online: true,
      link: '/chats/23'
   },
   {
      id: '24',
      name: 'Xavier Cruz',
      email: 'xavier.cruz@example.com',
      src: '/avatar24.png',
      online: false,
      link: '/chats/24'
   },
   {
      id: '25',
      name: 'Yara Hassan',
      email: 'yara.hassan@example.com',
      src: '/avatar25.png',
      online: true,
      link: '/chats/25'
   },
   {
      id: '26',
      name: 'Zain Malik',
      email: 'zain.malik@example.com',
      src: '/avatar26.png',
      online: false,
      link: '/chats/26'
   },
   {
      id: '27',
      name: 'Adam Wilson',
      email: 'adam.wilson@example.com',
      src: '/avatar27.png',
      online: true,
      link: '/chats/27'
   },
   {
      id: '28',
      name: 'Bella Martinez',
      email: 'bella.martinez@example.com',
      src: '/avatar28.png',
      online: false,
      link: '/chats/28'
   },
   {
      id: '29',
      name: 'Chris Anderson',
      email: 'chris.anderson@example.com',
      src: '/avatar29.png',
      online: true,
      link: '/chats/29'
   },
   {
      id: '30',
      name: 'Dana Peterson',
      email: 'dana.peterson@example.com',
      src: '/avatar30.png',
      online: false,
      link: '/chats/30'
   },

   {
      id: '31',
      name: 'Elias Gomez',
      email: 'elias.gomez@example.com',
      src: '/avatar31.png',
      online: true,
      link: '/chats/31'
   },
   {
      id: '32',
      name: 'Farah Ali',
      email: 'farah.ali@example.com',
      src: '/avatar32.png',
      online: false,
      link: '/chats/32'
   },
   {
      id: '33',
      name: 'Gabriel Stone',
      email: 'gabriel.stone@example.com',
      src: '/avatar33.png',
      online: true,
      link: '/chats/33'
   },
   {
      id: '34',
      name: 'Helena Brooks',
      email: 'helena.brooks@example.com',
      src: '/avatar34.png',
      online: false,
      link: '/chats/34'
   },
   {
      id: '35',
      name: 'Ivan Petrov',
      email: 'ivan.petrov@example.com',
      src: '/avatar35.png',
      online: true,
      link: '/chats/35'
   }
]
'use client'

import { useState } from 'react'
import { Bitshow } from '@/components/font/font'
import { Mail, Lock, ChevronRightIcon, User, Smile } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
   Drawer,
   DrawerContent,
   DrawerTitle,
   DrawerTrigger
} from '@/components/ui/drawer'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog2'
import {
   Item,
   ItemActions,
   ItemContent,
   ItemMedia,
   ItemTitle
} from '@/components/ui/item'
import { ProfileDropdown } from '@/components/ui/profile-dropdown'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

// Import the block components
import { PersonalDetailsOperation } from './blocks/personal-details-update'
import { AvatarOperation } from './blocks/avatar-update'
import { EmailOperation } from './blocks/email-update'
import { PasswordOperation } from './blocks/pw-update'

export default function AccountSettings() {
   const isMobile = useIsMobile()
   const [avatarKey, setAvatarKey] = useState(Date.now()) // Force avatar re-render
   const { data: session, isPending } = authClient.useSession()


   if (!session) return null

   const handleAvatarUpdated = (newImageUrl: string) => {
      // Update the session data optimistically
      if (session.user) {
         session.user.image = newImageUrl
         setAvatarKey(Date.now())
      }
      // Optionally refetch to ensure consistency
      //refetch();
   }

   const handleDetailsUpdated = () => {
      //refetch(); // Refresh session data
   }

   return (
      <div>
         <h1
            className={`${Bitshow.className} scroll-m-20 mt-5 text-center text-4xl font-extrabold tracking-tight text-balance`}
         >
            Account
         </h1>
         <p className='text-muted-foreground text-xs text-center'>
            Update your personal details, email, bio, password, and profile
            picture also add job and location.
         </p>

         <div className='mt-5 p-2 flex flex-col gap-2 md:grid md:grid-cols-2 justify-center'>
            <div className='w-full flex justify-center items-center col-span-2'>
               <ProfileDropdown
                  key={avatarKey} // Re-render when avatar changes
                  data={session.user}
               />
            </div>

            {/* Settings Items */}
            {isMobile ? (
               <>
                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Smile />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Profile Picture</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>Avatar</DrawerTitle>
                        <AvatarOperation
                           session={session}
                           onAvatarUpdated={handleAvatarUpdated}
                        />
                     </DrawerContent>
                  </Drawer>

                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <User />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Personal Details</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>
                           Personal Details
                        </DrawerTitle>
                        <PersonalDetailsOperation
                           session={session}
                           onSuccess={handleDetailsUpdated}
                        />
                     </DrawerContent>
                  </Drawer>

                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Mail />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Email</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>Email</DrawerTitle>
                        <EmailOperation session={session} />
                     </DrawerContent>
                  </Drawer>

                  <Drawer>
                     <DrawerTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Lock />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Password</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DrawerTrigger>
                     <DrawerContent>
                        <DrawerTitle className='sr-only'>Password</DrawerTitle>
                        <PasswordOperation />
                     </DrawerContent>
                  </Drawer>
               </>
            ) : (
               <>
                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Smile />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Profile Picture</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <AvatarOperation
                           session={session}
                           onAvatarUpdated={handleAvatarUpdated}
                        />
                     </DialogContent>
                  </Dialog>

                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <User />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Personal Details</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <PersonalDetailsOperation
                           session={session}
                           onSuccess={handleDetailsUpdated}
                        />
                     </DialogContent>
                  </Dialog>

                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Mail />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Email</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <EmailOperation session={session} />
                     </DialogContent>
                  </Dialog>

                  <Dialog>
                     <DialogTrigger asChild>
                        <Item
                           variant='outline'
                           size='sm'
                        >
                           <ItemMedia>
                              <Lock />
                           </ItemMedia>
                           <ItemContent>
                              <ItemTitle>Password</ItemTitle>
                           </ItemContent>
                           <ItemActions>
                              <ChevronRightIcon className='size-4' />
                           </ItemActions>
                        </Item>
                     </DialogTrigger>
                     <DialogContent>
                        <PasswordOperation />
                     </DialogContent>
                  </Dialog>
               </>
            )}
         </div>

         {/* Additional Info Card */}
         <Card className='m-2'>
            <CardContent>
               <CardTitle>Additional Info</CardTitle>
               <div className='md:grid md:grid-cols-2 lg:grid-cols-3'>
                  <p className='text-sm text-muted-foreground my-2'>
                     Joined at{' '}
                     <span className='text-foreground font-black'>
                        {new Date(session.user.createdAt).toLocaleDateString()}
                     </span>
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     Last profile update at{' '}
                     <span className='text-foreground font-black'>
                        {new Date(session.user.updatedAt).toLocaleDateString()}
                     </span>
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>52</span>{' '}
                     Total Chat Contacts
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>342</span>{' '}
                     Total Messages
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>2</span> Total
                     Pinned Chats
                  </p>
                  <p className='text-sm text-muted-foreground my-2'>
                     <span className='text-foreground font-black'>0</span> Total
                     Blocked Users
                  </p>
               </div>
            </CardContent>
         </Card>

         <p className='text-muted-foreground text-center'>
            <Link
               href='/legal'
               className='text-sm text-foreground underline underline-offset-4'
            >
               Terms of Service
            </Link>{' '}
            and{' '}
            <Link
               href='/legal'
               className='text-sm text-foreground underline underline-offset-4'
            >
               Privacy Policy
            </Link>
         </p>
      </div>
   )
}
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "@/components/font/text/count-up";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Zap,
  Sparkles,
  Building,
  LineChart,
  CheckCircle,
  Brain,
} from "lucide-react";
interface StatItemProps {
  value?: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  decimalPlaces?: number;
  color?: string;
}
const StatItem = ({
  _value,
  label,
  icon,
  delay = 0,
  _decimalPlaces = 0,
  color = "from-primary to-primary/70",
}: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={cn(
        "group border-border/30 bg-card relative overflow-hidden rounded-xl border p-6",
        resolvedTheme === "dark"
          ? "shadow-xl shadow-black/5"
          : "shadow-lg shadow-black/[0.03]",
      )}
    >
      <div
        className={cn(
          "absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-3xl",
          color,
        )}
      />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            color,
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <h3 className="flex items-baseline text-3xl font-bold tracking-tight">
            <CountUp to={100} />
            <span className="ml-1 text-sm font-medium opacity-70">+</span>
          </h3>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};
export default function About() {
  const aboutRef = useRef(null);
  const statsRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

  const stats = [
    {
      value: 5000,
      label: "Happy Users",
      icon: <Users className="h-5 w-5" />,
      delay: 0,
      color: "from-yellow-500 to-yellow-300",
      decimalPlaces: 0,
    },
    {
      value: 15,
      label: "AI powered",
      icon: <Brain className="h-5 w-5" />,
      delay: 0.1,
      color: "from-amber-500 to-amber-200",
      decimalPlaces: 0,
    },
    {
      value: 100,
      label: "Projects Completed",
      icon: <CheckCircle className="h-5 w-5" />,
      delay: 0.2,
      color: "from-yellow-500 to-yellow-800",
      decimalPlaces: 0,
    },
    {
      value: 24,
      label: "Cool Chat",
      icon: <Zap className="h-5 w-5" />,
      delay: 0.3,
      color: "from-amber-500 to-amber-400",
      decimalPlaces: 0,
    },
  ];
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Background pattern */}
      <div className=" absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <title>Background pattern</title>
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header Section with Badge */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 flex justify-center"
          >
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium"
            >
              <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
              About Us
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            About Our Platform{" "}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground mt-4 text-xl"
          >
            The first ai based communication platform.
          </motion.p>
        </div>
        {/* Stats Section */}
        <div ref={statsRef} className="mb-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatItem
                key={crypto.randomUUID()}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                delay={stat.delay || index * 0.1}
                decimalPlaces={stat.decimalPlaces}
                color={stat.color}
              />
            ))}
          </div>
        </div>
        {/* About Content Section */}
        {/*  <div
               ref={aboutRef}
               className='relative mx-auto mb-20'
            >
               <div className='grid gap-16 md:grid-cols-2'>
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={
                        aboutInView
                           ? { opacity: 1, y: 0 }
                           : { opacity: 0, y: 30 }
                     }
                     transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                     className='relative space-y-6'
                  >
                     <div className='from-primary/80 to-primary/60 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg'>
                        <Zap className='h-6 w-6' />
                     </div>
                     <h2 className='text-2xl font-bold tracking-tight'>
                        Our Mission
                     </h2>
                     <p className='text-muted-foreground text-base leading-relaxed'>
                        To empower businesses with innovative digital solutions
                        that drive growth, enhance user experiences, and create
                        lasting value in an ever-evolving technological
                        landscape.
                     </p>
                  </motion.div>
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={
                        aboutInView
                           ? { opacity: 1, y: 0 }
                           : { opacity: 0, y: 30 }
                     }
                     transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                     className='relative space-y-6'
                  >
                     <div className='inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/80 to-amber-500/60 text-white shadow-lg'>
                        <LineChart className='h-6 w-6' />
                     </div>
                     <h2 className='text-2xl font-bold tracking-tight'>
                        Our Vision
                     </h2>
                     <p className='text-muted-foreground text-base leading-relaxed'>
                        To be the leading provider of transformative digital
                        experiences, recognized globally for our commitment to
                        excellence, innovation, and client success.
                     </p>
                  </motion.div>
               </div>
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                     aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
                  className='mt-16 flex items-start gap-4'
               >
                  <div className='from-primary/20 to-primary/5 text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br'>
                     <Building className='h-5 w-5' />
                  </div>
                  <p className='text-muted-foreground text-base leading-relaxed'>
                     We are a passionate team of experts dedicated to delivering
                     exceptional solutions that help businesses thrive in the
                     digital landscape. Our commitment to innovation and quality
                     has made us a trusted partner for organizations worldwide.
                  </p>
               </motion.div>
            </div>*/}
      </div>
    </section>
  );
}
'use client'

import { ReactLenis } from 'lenis/react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import Message from '@/components/layout/chat/message'
import { Bitshow } from '@/components/font/font'

const demoMessages = [
   { id: 1, msg: 'Hi bro ☺️', sender: 'other' },
   { id: 2, msg: 'How are you my friend 👋', sender: 'user' },
   { id: 3, msg: 'Very well 👌', sender: 'other' },
   { id: 4, msg: "Ok what's wrong", sender: 'user' },
   { id: 5, msg: 'Can I ask  you some thing', sender: 'other' },
   { id: 6, msg: 'Now 😩', sender: 'user' },
   { id: 7, msg: 'a detailed report about todays job 🚨', sender: 'other' }
] as const

export default function ShowCase() {
   const containerRef = useRef<HTMLDivElement>(null)

   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start start', 'end end']
   })

   const smoothProgress = useSpring(scrollYProgress, {
      damping: 45,
      stiffness: 180
   })

   // Progress sections
   const messagesProgress = useTransform(smoothProgress, [0, 0.38], [0, 1])
   const thinkingProgress = useTransform(smoothProgress, [0.38, 0.52], [0, 1])
   const happyProgress = useTransform(smoothProgress, [0.52, 0.64], [0, 1])
   const clickSectionProg = useTransform(smoothProgress, [0.64, 0.82], [0, 1])
   const coolEndProgress = useTransform(smoothProgress, [0.82, 1.0], [0, 1])

   // For finger click timing
   const fingerClickProgress = useTransform(
      clickSectionProg,
      [0.35, 0.65],
      [0, 5]
   )
   const textReaction = useTransform(
      fingerClickProgress,
      [0, 0, 0.6, 1],
      [1, 1.18, 0.72, 0.68]
   )
   const aiTextGlow = useTransform(fingerClickProgress, v =>
      v > 0.4 && v < 0.7 ? 1 : 0
   )

   return (
      <ReactLenis
         root
         options={{
            duration: 1.65,
            easing: _t => t => Math.min(1, 1.001 - 2 ** (-10 * t)),
            smoothTouch: true,
            lerp: 0.065
         }}
      >
         <div
            ref={containerRef}
            className='min-h-[420vh] py-16 px-4 sm:px-6 lg:px-8 bg-background'
         >
            {/* ── 1. Centered stacking messages ── */}
            <div className='relative h-[200vh] flex items-start justify-center'>
               <div className='sticky top-[18vh] w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto'>
                  {demoMessages.map((item, i) => {
                     const start = i * 0.085
                     const prog = useTransform(
                        messagesProgress,
                        [start, start + 0.14, start + 0.24],
                        [0, 1, 1]
                     )

                     const y = useTransform(
                        prog,
                        [0, 1],
                        [140 + i * 50, i * -22]
                     )
                     const scale = useTransform(prog, [0, 1], [0.84, 1])
                     const opacity = useTransform(
                        prog,
                        [0, 0.35, 1],
                        [0, 0.4, 1]
                     )
                     const rotate = useTransform(
                        prog,
                        [0, 1],
                        [i % 2 === 0 ? 5 : -5, 0]
                     )

                     return (
                        <motion.div
                           key={item.id}
                           style={{
                              y,
                              scale,
                              opacity,
                              rotate,
                              zIndex: i + 0,
                              marginTop: '40%'
                           }}
                           className={`absolute left-1/2 -translate-x-1/2 origin-top w-full`}
                        >
                           <div className='mx-auto'>
                              <Message
                                 sender={item.sender}
                                 url={'#'}
                                 content={item.msg}
                                 timestamp={new Date()}
                                 demo={true}
                              />
                           </div>
                        </motion.div>
                     )
                  })}
               </div>
            </div>

            {/* ── 2. Thinking & Happy emojis ── */}
            <div className='relative h-[110vh] flex flex-col items-center justify-center gap-32'>
               <motion.div
                  style={{
                     scale: useTransform(
                        thinkingProgress,
                        [0, 0.5, 0.85, 1],
                        [0.5, 1.22, 0.92, 1]
                     ),
                     opacity: useTransform(thinkingProgress, [0, 0.3], [0, 1]),
                     y: useTransform(thinkingProgress, [0, 0.6], [90, 0])
                  }}
                  className='text-8xl sm:text-9xl md:text-[14rem] drop-shadow-2xl'
               >
                  <span>🤔</span>
               </motion.div>
               <h1 className={`${Bitshow.className} text-2xl font-black`}>
                  How can I answer it
               </h1>

               <motion.div
                  style={{
                     scale: useTransform(
                        happyProgress,
                        [0, 0.45, 0.8, 1],
                        [0.4, 1.25, 0.95, 1]
                     ),
                     opacity: useTransform(happyProgress, [0, 0.35], [0, 1]),
                     rotate: useTransform(
                        happyProgress,
                        [0, 0.6, 1],
                        [-18, 12, 0]
                     )
                  }}
                  className='text-8xl sm:text-9xl md:text-[14rem] drop-shadow-2xl'
               >
                  😃
               </motion.div>
            </div>

            {/* ── 3. 👆 Click → AI text reaction → zoom out ── */}
            <div className='relative flex items-center justify-center'>
               <div className='relative flex flex-col items-center'>
                  {/* Finger pointing & clicking */}
                  <motion.div
                     style={{
                        x: useTransform(
                           clickSectionProg,
                           [0, 0.4, 0.7, 1],
                           [-220, -60, 30, 0]
                        ),
                        y: useTransform(
                           clickSectionProg,
                           [0, 0.45, 0.75, 1],
                           [140, 50, -20, -40]
                        ),
                        scale: useTransform(
                           fingerClickProgress,
                           [0, 0.35, 0.55, 1],
                           [0.7, 1.15, 0.88, 0.8]
                        ),
                        rotate: useTransform(
                           clickSectionProg,
                           [0, 0.5, 0.8, 1],
                           [35, -8, 5, 0]
                        ),
                        opacity: useTransform(
                           clickSectionProg,
                           [0, 0.25],
                           [0, 1]
                        )
                     }}
                     className='text-8xl sm:text-9xl md:text-[12rem] absolute z-20 pointer-events-none'
                  >
                     👆
                  </motion.div>

                  {/* AI powered Chat text with reaction */}
                  <motion.h2
                     style={{
                        scale: textReaction,
                        opacity: useTransform(
                           clickSectionProg,
                           [0.15, 0.4],
                           [0, 1]
                        )
                     }}
                     className={`${Bitshow.className} text-5xl sm:text-6xl md:text-8xl lg:text-9xl z-10 text-center tracking-tight`}
                  >
                     <motion.span
                        style={{
                           scale: textReaction,
                           textShadow: useTransform(aiTextGlow, v =>
                              v
                                 ? '0 0 60px var(--primary), 0 0 120px var(--primary)'
                                 : 'none'
                           )
                        }}
                        className='bg-gradient-to-r from-primary via-primary/30 to-primary/70 bg-clip-text text-transparent inline-block'
                     >
                        AI
                     </motion.span>{' '}
                     powered Chat
                  </motion.h2>
               </div>
            </div>

            {/* ── 4. Cool 😎 ending ── */}
            <div className='relative h-[80vh] flex flex-col items-center justify-center'>
               <motion.div
                  style={{
                     scale: useTransform(
                        coolEndProgress,
                        [0, 0.35, 0.65, 1],
                        [0.2, 1.45, 0.92, 1.18]
                     ),
                     rotate: useTransform(
                        coolEndProgress,
                        [0, 0.4, 0.75, 1],
                        [-40, 25, -8, 0]
                     ),
                     opacity: useTransform(coolEndProgress, [0, 0.25], [0, 1]),
                     y: useTransform(coolEndProgress, [0, 0.5], [80, 0])
                  }}
                  className='text-8xl sm:text-9xl md:text-[16rem] drop-shadow-[0_0_50px_var(--primary)] mb-8'
               >
                  😎
               </motion.div>

               <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: [0, 1, 0.85, 1], y: 0 }}
                  transition={{
                     duration: 2.4,
                     times: [0, 0.4, 0.7, 1],
                     repeat: Infinity,
                     repeatDelay: 3
                  }}
                  className={`${Bitshow.className} text-4xl sm:text-5xl md:text-6xl font-black tracking-wider drop-shadow-lg`}
               >
                  COOL
               </motion.p>
            </div>
         </div>
      </ReactLenis>
   )
}
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import { Menu, X, ArrowRight, Home, Info, Phone, Banknote } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/icon/icons'
import { ThemeToggleButton } from '@/components/shared/theme-toggler-button'
import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'
import { Sun, Moon, LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Bitshow } from '@/components/font/font'
import { authClient } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface NavItem {
   name: string
   href: string
   icon: LucideIcon
}

const navItems: NavItem[] = [
   { name: 'Home', href: '/', icon: Home },
   { name: 'Contact', href: '/contact', icon: Phone },
   { name: 'About', href: '/about', icon: Banknote },
   { name: 'Features', href: '/features', icon: Info }
]

export default function Nav() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
   const [hoveredItem, setHoveredItem] = useState<string | null>(null)
   const [mounted, setMounted] = useState(false)
   const { theme, resolvedTheme } = useTheme()
   const { data: session } = authClient.useSession()
   // const session = {
   //   user: {
   //     name: "Amanuel Antenh",
   //     email: "amanuelantenha@gmail.com",
   //     image: "/avatar.png",
   //   },
   // };

   useEffect(() => setMounted(true), [])
   if (!mounted) return null

   const icon =
      theme === 'system' ? (
         resolvedTheme === 'dark' ? (
            <Moon />
         ) : (
            <Sun />
         )
      ) : theme === 'dark' ? (
         <Moon />
      ) : (
         <Sun />
      )
   const containerVariants = {
      hidden: { opacity: 0, y: -20 },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            duration: 0.6,
            staggerChildren: 0.1
         }
      }
   }

   const itemVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0 }
   }

   const mobileMenuVariants = {
      closed: {
         opacity: 0,
         x: '100%',
         transition: {
            duration: 0.3,
            ease: easeInOut
         }
      },
      open: {
         opacity: 1,
         x: 0,
         transition: {
            duration: 0.3,
            ease: easeInOut,
            staggerChildren: 0.1
         }
      }
   }

   const mobileItemVariants = {
      closed: { opacity: 0, x: 20 },
      open: { opacity: 1, x: 0 }
   }

   return (
      <>
         <motion.header
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 
                   "bg-transparent"
            `}
            variants={containerVariants}
            initial='hidden'
            animate='visible'
         >
            <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
               <div className='flex h-16 items-center justify-between'>
                  <motion.div
                     className='flex items-center space-x-3'
                     variants={itemVariants}
                     whileHover={{ scale: 1.02 }}
                     transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25
                     }}
                  >
                     <div className='flex items-center  gap-3'>
                        <Link
                           prefetch={false}
                           href='/'
                           className='flex items-center space-x-3'
                        >
                           <div className='flex items-center gap-1'>
                              <Logo size={60} />
                              <h1 className={`${Bitshow.className}`}>
                                 Hyperchat
                              </h1>
                           </div>
                        </Link>
                     </div>
                  </motion.div>

                  <nav className='hidden items-center space-x-1 lg:flex'>
                     {navItems.map(item => (
                        <motion.div
                           key={item.name}
                           variants={itemVariants}
                           className='relative'
                           onMouseEnter={() => setHoveredItem(item.name)}
                           onMouseLeave={() => setHoveredItem(null)}
                        >
                           <Link
                              prefetch={false}
                              href={item.href}
                              className='text-foreground/80 hover:text-foreground relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200'
                           >
                              {hoveredItem === item.name && (
                                 <motion.div
                                    className='bg-muted absolute inset-0 rounded-lg'
                                    layoutId='navbar-hover'
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                       type: 'spring',
                                       stiffness: 400,
                                       damping: 30
                                    }}
                                 />
                              )}
                              <span className='relative z-10'>{item.name}</span>
                           </Link>
                        </motion.div>
                     ))}
                  </nav>
                  <motion.div
                     className='hidden items-center space-x-3 lg:flex'
                     variants={itemVariants}
                  >
                     <Button>
                        <Label htmlFor='themeBtn'>{icon}</Label>
                     </Button>
                     <ThemeToggleButton
                        variant='circle'
                        start='center'
                        className='hidden'
                     />
                     {session ? (
                        <DropdownMenu asChild>
                           <DropdownMenuTrigger>
                              <Avatar className='w-14 h-14'>
                                 <AvatarImage
                                    src={session.user.image || "/avatar.png"}
                                    alt={session.user.name}
                                 />
                                 <AvatarFallback>
                                    {session.user.name.slice(0, 1)}
                                 </AvatarFallback>
                              </Avatar>
                           </DropdownMenuTrigger>
                           <Link href='/profile'>
                              <DropdownMenuContent>
                                 <DropdownMenuLabel>
                                    My account
                                 </DropdownMenuLabel>
                                 <DropdownMenuItem>
                                    {session.user.name}
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator />
                                 <Link
                                    href='/profile'
                                    className='pt-1 flex justify-between items-center'
                                 >
                                    <DropdownMenuItem>
                                       {session.user.email}
                                    </DropdownMenuItem>
                                 </Link>
                                 <DropdownMenuItem>
                                    <Link href='/'>
                                       <Button
                                          onClick={() => authClient.signOut()}
                                          type='button'
                                          clasw-ful='w-full'
                                       >
                                          Sign Out
                                       </Button>
                                    </Link>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </Link>
                        </DropdownMenu>
                     ) : (
                        <motion.div
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                        >
                           <Link
                              prefetch={false}
                              href='/sign-up'
                              className='bg-foreground text-background hover:bg-foreground/90 inline-flex items-center space-x-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-200'
                           >
                              <span>Signup</span>
                              <ArrowRight className='h-4 w-4' />
                           </Link>
                        </motion.div>
                     )}
                  </motion.div>

                  <motion.button
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     variants={itemVariants}
                     whileTap={{ scale: 0.95 }}
                     className='lg:hidden'
                  >
                     {isMobileMenuOpen ? (
                        <X className='h-6 w-6' />
                     ) : (
                        <Menu className='h-6 w-6' />
                     )}
                  </motion.button>
               </div>
            </div>
         </motion.header>

         <AnimatePresence>
            {isMobileMenuOpen && (
               <>
                  <motion.div
                     className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <motion.div
                     className='border-border bg-background fixed top-16 right-4 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl lg:hidden w-[93%]'
                     variants={mobileMenuVariants}
                     initial='closed'
                     animate='open'
                     exit='closed'
                  >
                     <div className='space-y-6 p-6'>
                        <div className='space-y-1'>
                           {navItems.map(item => (
                              <motion.div
                                 key={item.name}
                                 variants={mobileItemVariants}
                              >
                                 <Link
                                    prefetch={false}
                                    href={item.href}
                                    className='text-foreground hover:bg-muted block rounded-lg px-4 py-3 font-medium transition-colors duration-200 flex justify-between items-center '
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    <span>{item.name}</span>
                                    <item.icon />
                                 </Link>
                              </motion.div>
                           ))}
                        </div>

                        <motion.div
                           className='border-border space-y-3 border-t pt-6'
                           variants={mobileItemVariants}
                        >
                           <Button>
                              <Label htmlFor='themeBtn'>{icon}</Label>
                           </Button>
                           <ThemeToggleButton
                              variant='circle'
                              start='center'
                              className='hidden'
                           />
                           {session ? (
                              <>
                                 <Link
                                    href='/profile'
                                    className='pt-1 flex justify-between items-center'
                                 >
                                    <div>
                                       <div className='max-w-[250px] overflow-x-scroll'>
                                          <p className='text-2xl underline'>
                                             {session.user.name}
                                          </p>
                                          <p className='text-muted-foreground'>
                                             {session.user.email}
                                          </p>
                                       </div>
                                    </div>
                                    <Avatar className='w-14 h-14'>
                                       <AvatarImage
                                                                              src={session.user.image || "/avatar.png"}

                                          alt={session.user.name}
                                       />
                                       <AvatarFallback className='text-2xl'>
                                          {session.user.name
                                             .slice(0, 2)
                                             .toUpperCase()}
                                       </AvatarFallback>
                                    </Avatar>
                                 </Link>

                                 <Button
                                    onClick={() => authClient.signOut()}
                                    type='button'
                                 >
                                    Sign Out
                                 </Button>
                              </>
                           ) : (
                              <>
                                 <Link
                                    prefetch={false}
                                    href='/sign-in'
                                    className='bg-primary block w-full rounded-lg py-3 text-center font-medium transition-all duration-200'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    Log in
                                 </Link>
                                 <Link
                                    prefetch={false}
                                    href='/sign-up'
                                    className='bg-foreground text-primary block w-full rounded-lg py-3 text-center font-medium transition-all duration-200 dark:text-black'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    Sign up
                                 </Link>
                              </>
                           )}
                        </motion.div>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>
   )
}
'use client'

import type React from 'react'
import { Button as button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
   Mic,
   Paperclip,
   Plus,
   Search,
   ArrowRight,
   Smile,
   Image,
   Edit,
   MapPin,
   CircleDot,
   Brain
} from 'lucide-react'
import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { VoiceInput } from '@/components/ui/voice-input'

interface MsgInputProps {
   message: string
   setMessage: (value: string) => void
   onSend: () => void
}

export default function MsgInput({
   message,
   setMessage,
   onSend
}: MsgInputProps) {
   const [isExpanded, setIsExpanded] = useState(false)
   const textareaRef = useRef<HTMLTextAreaElement>(null)
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [listening, setListening] = useState<boolean>(false)
   const isMobile = useIsMobile()

   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value)

      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto'
         textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }

      if (isMobile) {
         setIsExpanded(
            e.target.value.length > 10 || e.target.value.includes('\n')
         )
      } else {
         setIsExpanded(
            e.target.value.length > 50 || e.target.value.includes('\n')
         )
      }
   }
   const onStart = () => {
      setListening(true)
   }
   const onStop = () => {
      setListening(false)
   }

   const handleKeyDown = (_e: React.KeyboardEvent) => {
      /*if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         handleSubmit(e as any)
      }*/
   }

   return (
      <div className='md:w-full fixed md:bottom-10 md:left-[10%] md:right-[5%] bottom-2 left-2 right-2'>
         <form
            onSubmit={onSend}
            className='group/composer'
         >
            <input
               ref={fileInputRef}
               type='file'
               multiple
               className='sr-only'
               onChange={() => {}}
            />

            <div
               className={cn(
                  'backdrop-blur-lg w-full sm:max-w-2xl mx-auto bg-transparent dark:bg-muted/50 cursor-text overflow-clip bg-clip-padding p-2.5 shadow-lg border border-border transition-all duration-200',
                  {
                     'rounded-3xl grid grid-cols-1 grid-rows-[auto_1fr_auto]':
                        isExpanded,
                     'rounded-[28px] grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto]':
                        !isExpanded
                  }
               )}
               style={{
                  gridTemplateAreas: isExpanded
                     ? "'header' 'primary' 'footer'"
                     : "'header header header' 'leading primary trailing' '. footer .'"
               }}
            >
               <div
                  className={cn(
                     'flex min-h-14 items-center overflow-x-hidden px-1.5',
                     {
                        'px-2 py-1 mb-0': isExpanded,
                        '-my-2.5': !isExpanded
                     }
                  )}
                  style={{ gridArea: 'primary' }}
               >
                  <div className='flex-1 overflow-auto max-h-52'>
                     <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Your Message___'
                        className='placeholder:whitespace-nowrap min-h-0 resize-none rounded-none border-0 p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin dark:bg-transparent'
                        rows={1}
                        disabled={listening ? true : undefined}
                     />
                  </div>
               </div>

               <div
                  className={cn('flex', { hidden: isExpanded })}
                  style={{ gridArea: 'leading' }}
               >
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <button
                           type='button'
                           variant='ghost'
                           size='icon'
                           className='outline-none flex bg-card/50 backdrop-blur-lg cursor-pointer items-center justify-center rounded-full border p-2'
                        >
                           <Plus />
                        </button>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent
                        align='start'
                        className='max-w-xs p-1.5 text-muted-foreground grid grid-cols-2'
                     >
                        <DropdownMenuItem
                           className='rounded-[calc(1rem-6px)] font-black'
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <Paperclip
                              size={20}
                              className='opacity-60'
                           />
                           Add files
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className='rounded-[calc(1rem-6px)] font-black'
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <Image
                              size={20}
                              className='opacity-60'
                           />
                           Add photos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className='rounded-[calc(1rem-6px)] font-black'
                           onClick={() => {}}
                        >
                           <Smile
                              size={20}
                              className='opacity-60'
                           />
                           Emoji
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className='rounded-[calc(1rem-6px)] font-black'
                           onClick={() => {}}
                        >
                           <Search
                              size={20}
                              className='opacity-60'
                           />
                           Sticker
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className='rounded-[calc(1rem-6px)] font-black'
                           onClick={() => {}}
                        >
                           <MapPin
                              size={20}
                              className='opacity-60'
                           />
                           Location
                        </DropdownMenuItem>
                        <DropdownMenuItem
                           className='rounded-[calc(1rem-6px)] font-black'
                           onClick={() => {}}
                        >
                           <CircleDot
                              size={20}
                              className='opacity-60'
                           />
                           Choice
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               <div
                  className='flex items-center gap-2'
                  style={{ gridArea: isExpanded ? 'footer' : 'trailing' }}
               >
                  <div className='ms-auto flex items-center gap-1.5'>
                     <button
                        disabled={listening ? true : undefined}
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-9 w-9 rounded-full hover:bg-accent relative'
                     >
                        <Brain className='size-5 text-muted-foreground' />
                     </button>
                     <button
                        disabled={listening ? true : undefined}
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-9 w-9 rounded-full hover:bg-accent relative'
                     >
                        <Edit className='size-5 text-muted-foreground' />
                     </button>

                     {/*<Mic className='size-5 text-muted-foreground' />*/}
                     <VoiceInput
                        onStop={onStop}
                        onStart={onStart}
                        className={isExpanded && 'pr-1'}
                     />

                     {message.trim() && (
                        <motion.button
                           initial={{ rotate: 100, opacity: 0 }}
                           whileInView={{ rotate: 0, opacity: 1 }}
                           exit={{ rotate: -100, opacity: 0 }}
                           transition={{ type: 'spring' }}
                           type='submit'
                           
                           onClick={()=> setIsExpanded(false)}
                           className='h-9 w-9 rounded-full text-background bg-primary flex justify-center items-center shadow-xl shadow-primary/30  hover:shadow-xl'
                        >
                           <ArrowRight className='size-6' />
                        </motion.button>
                     )}
                  </div>
               </div>
            </div>
         </form>
      </div>
   )
}
'use client'

import { useRef, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MsgInput from '@/components/layout/chat/msg-input'
import Message from '@/components/layout/chat/message'
import ChatRoomNav from '@/components/layout/chat/chat-room-nav'
import { useConversation } from '@/hooks/use-conversation'
import { useSession } from '@/lib/auth-client'
import { randomHiEmoji } from '@/lib/utils'
import {
   Empty,
   EmptyContent,
   EmptyHeader,
   EmptyTitle,
   EmptyDescription
} from '@/components/ui/empty'

export default function ChatRoom() {
   const params = useParams()
   const conversationId = params.chatId as string
   const { data: session } = useSession()
   const userId = session?.user?.id

   const { messages, setMessages, loading } = useConversation(conversationId)
   const bottomRef = useRef<HTMLDivElement>(null)
   const [messageInput, setMessageInput] = useState<string>("");

   // Fetch initial messages
   // Inside ChatRoom component, add:
   useEffect(() => {
      if (!conversationId) return
      // Mark conversation as read when entering
      fetch(`/api/conversations/${conversationId}/read`, {
         method: 'POST'
      }).catch(console.error)
   }, [conversationId])
   useEffect(() => {
      if (!conversationId) return

      const fetchMessages = async () => {
         try {
            const res = await fetch(
               `/api/conversations/${conversationId}/messages`
            )
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setMessages(data)
         } catch (error: any)  {
            console.error('Failed to fetch messages', error)
         }
      }

      fetchMessages()
   }, [conversationId, setMessages])

   const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
      bottomRef.current?.scrollIntoView({ behavior })
   }

   useEffect(() => {
      scrollToBottom()
   }, [messages])

   const handleSendMsg = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!messageInput.trim() || !userId) return

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const optimisticMessage = {
         id: tempId,
         content: messageInput,
         senderId: userId,
         sender: {
            id: userId,
            name: session?.user?.name || 'You',
            image: null
         },
         createdAt: new Date(),
         type: 'TEXT',
         edited: false
      }

      // Add optimistic message
      setMessages(prev => [...prev, optimisticMessage])
      setMessageInput('')

      try {
         const res = await fetch(
            `/api/conversations/${conversationId}/messages`,
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ content: messageInput })
            }
         )
         if (!res.ok) throw new Error('Send failed')
         const sentMessage = await res.json()

         setMessages(prev => {
            // Remove the temporary optimistic message
            const withoutTemp = prev.filter(m => m.id !== tempId)
            // Add the real message only if it's not already present (e.g., from Ably)
            if (!withoutTemp.some(m => m.id === sentMessage.id)) {
               return [...withoutTemp, sentMessage]
            }
            return withoutTemp // real message already there
         })
      } catch (error: any)  {
         console.error('Send error', error)
         // Remove optimistic message on failure
         setMessages(prev => prev.filter(m => m.id !== tempId))
      }
   }

   const handleEditMessage = async (messageId: string, newContent: string) => {
      if (!newContent?.trim()) return
      try {
         const res = await fetch(`/api/messages/${messageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent })
         })
         if (!res.ok) {
            const errorText = await res.text()
            console.error('Edit failed:', res.status, errorText)
            throw new Error('Edit failed')
         }
         const updated = await res.json()
         setMessages(prev => prev.map(m => (m.id === messageId ? updated : m)))
      } catch (error: any)  {
         console.error('Edit error', error)
      }
   }

   const handleDeleteMessage = async (messageId: string) => {
      try {
         const res = await fetch(`/api/messages/${messageId}`, {
            method: 'DELETE'
         })
         if (!res.ok) throw new Error('Delete failed')
         setMessages(prev => prev.filter(m => m.id !== messageId))
      } catch (error: any)  {
         console.error('Delete error', error)
      }
   }

   return (
      <div className='flex flex-col justify-center p-3 mt-5 min-h-screen'>
         <ChatRoomNav conversationId={conversationId} />
         <div className='md:m-0 pt-5 pb-64 md:pb-52 overflow-y-scroll'>
            <ul>
               {messages.length < 1 ? (
                  <Empty className='border border-dashed border-4 py-10 px-10 mt-10 w-max mx-auto'>
                     <EmptyHeader>
                        <EmptyTitle>No message yet.</EmptyTitle>
                        <EmptyDescription>Say hi</EmptyDescription>
                     </EmptyHeader>
                     <EmptyContent>
                        <h1
                           className='text-9xl'
                           onClick={() => {
                              setMessageInput(randomHiEmoji())
                           }}
                        >
                           {randomHiEmoji()}
                        </h1>
                     </EmptyContent>
                  </Empty>
               ) : (
                  messages.map(msg => (
                     <Message
                        key={msg.id}
                        id={msg.id}
                        sender={msg.senderId === userId ? 'user' : 'other'}
                        url={`/${msg.sender?.email?.split('@')[0] || ''}`}
                        content={msg.content}
                        timestamp={new Date(msg.createdAt)}
                        onEdit={
                           msg.senderId === userId &&
                           !msg.id.startsWith('temp-')
                              ? newContent =>
                                   handleEditMessage(msg.id, newContent)
                              : undefined
                        }
                        onDelete={
                           msg.senderId === userId &&
                           !msg.id.startsWith('temp-')
                              ? () => handleDeleteMessage(msg.id)
                              : undefined
                        }
                     />
                  ))
               )}
            </ul>

            <MsgInput
               message={messageInput}
               setMessage={setMessageInput}
               onSend={handleSendMsg}
            />

            <div ref={bottomRef} />
         </div>
      </div>
   )
}
"use client";

import Link from "next/link";
import { ArrowRight, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Logo, GoogleIcon } from "@/components/icon/icons";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PwInput } from "@/components/ui/pw-input";
import { validateSignUp } from "@/actions/validation";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.push("/chats");
    }
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Get password from form - assuming PwInput has a name attribute of "password"
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Validate signup data
      const isValid = await validateSignUp(name, email, password);

      if (isValid) {
        setLoading(false);

        // Sign up with email
        await authClient.signUp.email(
          {
            name,
            email,
            password,
            callbackURL: "/chats",
          },
          {
            onRequest: () => {
              setLoading(true);
            },
            onSuccess: () => {
              setLoading(false);
              toast.success("Account created successfully!");
              router.push("/chats");
            },
            onError: (ctx) => {
              setLoading(false);
              toast.error("Sign up failed", {
                description:
                  ctx.error.message || "An Error Occurred try it again.",
              });
            },
          },
        );
      }
    } catch (error: any)  {
      console.error("Signup error:", error);
      toast.error("An error occurred", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);

      const { _, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/chats",
        errorCallbackURL: "/error",
      });

      if (error) {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed", {
          description: error.message || "Please try again",
        });
        return;
      }

      // If successful, the user will be redirected by the auth provider
      // No need to manually redirect here
    } catch (error: any)  {
      console.error("Google sign-in failed:", error);
      toast.error("Sign-in failed", {
        description: "Please try again",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center min-h-screen"
    >
      <div className="mx-auto w-full max-w-lg space-y-6 p-4 md:shadow-xl md:p-10 md:rounded-xl">
        <SignupHeader />
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 rounded-xl"
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <GoogleIcon className="h-4 w-4" />
                Sign Up with Google
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              or sign up with email
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative mt-2.5">
                <Input
                  required
                  id="name"
                  className="peer ps-9 rounded-xl bg-background"
                  placeholder="John Doe"
                  type="text"
                  name="name"
                  disabled={loading || googleLoading}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <User size={16} aria-hidden="true" />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2.5">
                <Input
                  required
                  id="email"
                  className="peer ps-9 rounded-xl bg-background"
                  placeholder="demo@gmail.com"
                  type="email"
                  name="email"
                  disabled={loading || googleLoading}
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <Mail size={16} aria-hidden="true" />
                </div>
              </div>
            </div>

            <PwInput disabled={loading || googleLoading} />
          </div>

          <Button
            className="w-full rounded-xl"
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <span>Creating...</span>
                <Spinner />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <SignupFooter />
        </form>
      </div>
    </motion.div>
  );
}

function SignupHeader() {
  return (
    <div className="space-y-2 text-center flex justify-between items-center flex-col">
      <Link href="/">
        <Logo />
      </Link>
      <h1 className="text-3xl font-semibold">Create Account</h1>
      <p className="text-muted-foreground">
        Signup to create new hyper-chat account.
      </p>
    </div>
  );
}

function SignupFooter() {
  return (
    <div className="text-center text-sm">
      You have an account?{" "}
      <Link
        href="/sign-in"
        className="text-primary font-medium hover:underline"
      >
        Sign in
      </Link>
    </div>
  );
}
import Image from "next/image";

export function Logo({ size = 50 }) {
  return (
    <Image src="/icon/favicon.png" alt="logo" width={size} height={"auto"} />
  );
}
'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

interface ActionResult {
   success: boolean
   error?: string
}

export async function changeEmailAction(
   newEmail: string
): Promise<ActionResult> {
   try {
      if (!newEmail) {
         return {
            success: false,
            error: 'Email is required'
         }
      }

      const result = await auth.api.changeEmail({
         headers: await headers(),
         body: {
            newEmail
         }
      })

      if (result?.error) {
         return {
            success: false,
            error: result.error.message ?? 'Failed to update email'
         }
      }

      return { success: true }
   } catch (error) {
      console.error('Email update error:', error)

      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error'
      }
   }
}

interface ActionResult {
   success: boolean
   error?: string
}

export async function updatePasswordAction(
   formData: FormData
): Promise<ActionResult> {
   try {
      const currentPassword = formData.get('current-password') as string
      const newPassword = formData.get('new-password') as string

      if (!currentPassword || !newPassword) {
         return {
            success: false,
            error: 'Missing password fields'
         }
      }

      const result = await auth.api.changePassword({
         headers: await headers(),
         body: {
            currentPassword,
            newPassword
         }
      })

      if (result?.error) {
         return {
            success: false,
            error: result.error.message ?? 'Failed to update password'
         }
      }

      return { success: true }
   } catch (error) {
      console.error('Password update error:', error)

      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error'
      }
   }
}
