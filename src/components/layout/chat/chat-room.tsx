'use client'
import { useRef, useState, useEffect } from 'react'
import MsgInput from '@/components/layout/chat/msg-input'
import Message from '@/components/layout/chat/message'
import ChatRoomNav from '@/components/layout/chat/chat-room-nav'

export default function ChatRoom() {
   const bottomRef = useRef<HTMLDivElement>(null)
   const [message, setMessage] = useState('')
   const [messages, setMessages] = useState<string[]>(demoMessages)

   const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
      bottomRef.current?.scrollIntoView({ behavior })
   }

   const handleSendMsg = (e: React.FormEvent) => {
      e.preventDefault()
      if (!message.trim()) return

      setMessages(prev => [
         ...prev,
         {
            id: crypto.randomUUID(),
            sender: 'user',
            content: message,
            timestamp: new Date()
         }
      ])

      setMessage('')
   }

   // Scroll to bottom whenever messages change
   useEffect(() => {
      scrollToBottom()
   }, [messages])

   // Scroll to bottom on initial render after DOM is ready
   useEffect(() => {
      requestAnimationFrame(() => scrollToBottom('auto')) // use 'auto' for instant scroll
   }, [])

   return (
      <div className='flex flex-col justify-center p-3 mt-5 min-h-screen'>
         <ChatRoomNav />
         <div className='md:m-0 pt-5 pb-64 md:pb-52  overflow-y-scroll'>
            <ul>
               {messages.map(msg => (
                  <Message
                     key={msg.id} // stable key
                     id={msg.id}
                     sender={msg.sender}
                     url='/'
                     content={msg.content}
                     timestamp={msg.timestamp}
                  />
               ))}
            </ul>

            <MsgInput
               message={message}
               setMessage={setMessage}
               onSend={handleSendMsg}
            />

            <div ref={bottomRef} />
         </div>
      </div>
   )
}
type demoMessagesTypes = {
   id: string
   sender: string
   content: string
   timestamp: string
}

const demoMessages: demoMessagesTypes[] = [
   {
      id: 'etfxae578okb',
      sender: 'user',
      content:
         'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit sequi a ullam ad excepturi, exercitationem fugit nesciunt sed reprehenderit molestiae ab hic delectus architecto quia totam sint quo, inventore, tempora',
      timestamp: new Date()
   },
   {
      id: 'etfxae58okb',
      sender: 'other',
      url: '/',
      content:
         'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit sequi a ullam ad excepturi, exercitationem fugit nesciunt sed reprehenderit molestiae ab hic delectus architecto quia totam sint quo, inventore, tempora',
      timestamp: new Date()
   },
   {
      id: 'etfae578okb',
      sender: 'user',
      content: 'Hello there!',
      timestamp: new Date()
   },
   {
      id: 'etfxae57kb',

      content:
         'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis qui, accusamus doloremque doloribus laborum officia labore pariatur aliquid assumenda architecto nihil quas nam voluptas cum adipisci, voluptatum enim rerum iusto.',
      timestamp: new Date()
   }
]
