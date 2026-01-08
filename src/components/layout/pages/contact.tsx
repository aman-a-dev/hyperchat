'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, Phone } from 'lucide-react'

const contactInfo = [
   {
      icon: Mail,
      label: 'Email',
      value: 'amanarttik@gmail.com',
      href: 'mailto:amanarttik@gmail.com'
   },

   {
      icon: MapPin,
      label: 'Location',
      value: 'Ethiopia,Addis Ababa',
      href: '#'
   }
]

export default function Contact() {
   return (
      <section className='w-full py-16 md:py-24 relative'>
         <div className=' absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]'>
            <svg
               className='h-full w-full'
               xmlns='http://www.w3.org/2000/svg'
            >
               <defs>
                  <pattern
                     id='grid'
                     width='40'
                     height='40'
                     patternUnits='userSpaceOnUse'
                  >
                     <path
                        d='M 40 0 L 0 0 0 40'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1'
                     />
                  </pattern>
               </defs>
               <rect
                  width='100%'
                  height='100%'
                  fill='url(#grid)'
               />
            </svg>
         </div>
         <div className='mx-auto w-full'>
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className='mb-16 text-center'
            >
               <Badge
                  variant='outline'
                  className='border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium'
               >
                  <Phone className='text-primary mr-1 h-3.5 w-3.5' />
                  Contact
               </Badge>
               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  className='from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent my-5 sm:text-5xl'
               >
                  Contact Us
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  className='text-muted-foreground mt-4 text-xl'
               >
                  Get in touch with us
               </motion.p>
            </motion.div>

            <div className='grid gap-8 lg:grid-cols-2'>
               {/* Contact Form */}
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
               >
                  <Card className='border-border bg-card p-6 md:p-8 mx-5 md:mx-1'>
                     <form className='space-y-6'>
                        <div className='space-y-2'>
                           <Label htmlFor='name'>Name</Label>
                           <Input
                              id='name'
                              placeholder='Your name'
                              className='bg-background rounded-xl'
                           />
                        </div>

                        <div className='space-y-2'>
                           <Label htmlFor='email'>Email</Label>
                           <Input
                              id='email'
                              type='email'
                              placeholder='your.email@example.com'
                              className='bg-background rounded-xl'
                           />
                        </div>

                        <div className='space-y-2'>
                           <Label htmlFor='subject'>Subject</Label>
                           <Input
                              id='subject'
                              placeholder='How can I help you?'
                              className='bg-background rounded-xl'
                           />
                        </div>

                        <div className='space-y-2'>
                           <Label htmlFor='message'>Message</Label>
                           <Textarea
                              id='message'
                              placeholder='Tell me about your project...'
                              rows={5}
                              className='rounded-xl bg-background h-[110px]'
                           />
                        </div>

                        <Button
                           type='submit'
                           className='w-full gap-2 rounded-xl'
                        >
                           Send Message
                           <Send className='h-4 w-4' />
                        </Button>
                     </form>
                  </Card>
               </motion.div>

               {/* Contact Info */}
               <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className='space-y-6 mx-5 md:mx-1'
               >
                  {contactInfo.map((info, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                     >
                        <Card className='group border-border bg-card p-6 transition-all duration-300 hover:border-primary/50'>
                           <a
                              href={info.href}
                              className='flex items-start gap-4'
                           >
                              <motion.div
                                 whileHover={{ scale: 1.1, rotate: 5 }}
                                 transition={{ duration: 0.3 }}
                                 className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'
                              >
                                 <info.icon className='h-5 w-5' />
                              </motion.div>
                              <div>
                                 <h3 className='mb-1 font-semibold text-foreground transition-colors group-hover:text-primary'>
                                    {info.label}
                                 </h3>
                                 <p className='text-muted-foreground'>
                                    {info.value}
                                 </p>
                              </div>
                           </a>
                        </Card>
                     </motion.div>
                  ))}

                  <Card className='border-border bg-card p-6 md:p-8'>
                     <h3 className='mb-4 text-xl font-semibold text-foreground'>
                        Working Hours
                     </h3>
                     <div className='space-y-3 text-muted-foreground'>
                        <div className='flex justify-between'>
                           <span>Monday - Friday</span>
                           <span className='font-medium'>
                              9:00 AM - 6:00 PM
                           </span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Saturday</span>
                           <span className='font-medium'>Closed</span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Sunday</span>
                           <span className='font-medium'>Closed</span>
                        </div>
                     </div>
                  </Card>
               </motion.div>
            </div>
         </div>
      </section>
   )
}
