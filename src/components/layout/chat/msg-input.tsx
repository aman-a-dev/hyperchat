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
                           size='icon'
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
