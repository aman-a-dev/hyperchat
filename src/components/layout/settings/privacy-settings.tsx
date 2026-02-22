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
         } catch (error) {
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
      } catch (error) {
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
