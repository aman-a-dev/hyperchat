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
   const closeDialogRef = useRef<HTMLDivElement | null>(false)
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
