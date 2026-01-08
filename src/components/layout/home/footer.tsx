'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

import { Logo } from '@/components/icon/icons'
import { motion } from 'motion/react'
import { Github, Linkedin, Twitter, ArrowDownLeft } from 'lucide-react'
import { starborn } from '@/components/font/font'

const data = () => ({
   navigation: {
      product: [
         { name: 'Features', href: '/features' },
         { name: 'Pricing', href: '/pricing' }
      ],
      company: [
         { name: 'About', href: '/about' },
         { name: 'Contact', href: '/contact' }
      ],
      resources: [
         { name: 'Blog', href: '/blog' },

      ],
      legal: [
         { name: 'legal', href: '/legal' },
         { name: 'Terms', href: '/legal' },
         { name: 'Cookie Policy', href: '/legal' }
      ]
   },
   socialLinks: [
      { icon: Twitter, label: 'Twitter', href: 'https://x.com/Aman_A_Dev' },
      { icon: Github, label: 'GitHub', href: 'https://github.com/aman-a-dev' },
      {
         icon: Linkedin,
         label: 'LinkedIn',
         href: 'https://www.linkedin.com/in/amanuel-antenh-20657436a'
      }
   ],
   bottomLinks: [
      { href: '/legal', label: 'legal Policy' },
      { href: '/legal', label: 'Terms of Service' },
      { href: '/legal', label: 'Cookie Policy' }
   ]
})

export default function Footer() {
   const [mounted, setMounted] = useState(false)
   useEffect(() => {
      setMounted(true)
   }, [])
   const currentYear = new Date().getFullYear()
   if (!mounted) return null
   return (
      <motion.footer
         initial={{ y: 50 }}
         whileInView={{ y: 0 }}
         viewport={{ once: false }}
         transition={{ duration: 1.5, type: 'spring' }}
         className='mt-20 w-full'
      >
         <div className='via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent' />
         <div className='relative w-full px-5'>
            {/* Top Section */}
            <div className='container m-auto grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5'>
               {/* Company Info */}
               <div className='space-y-6 lg:col-span-2'>
                  <Link
                     href='/'
                     className='inline-flex items-center gap-3'
                  >
                     <Logo />
                     <span
                        className={`${starborn.className} text-xl font-semibold`}
                     >
                        Hyper-chat
                     </span>
                  </Link>
                  <p className='text-muted-foreground max-w-md'>
                     Unlimited AI Powered Chating Platform.
                  </p>
                  <div className='flex items-center gap-2'>
                     <div className='flex gap-2'>
                        {data().socialLinks.map(
                           ({ icon: Icon, label, href }) => (
                              <Button
                                 key={label}
                                 size='icon'
                                 variant='outline'
                                 className='hover:bg-primary dark:hover:bg-primary !border-primary/30 !hover:border-primary cursor-pointer shadow-none transition-all duration-500 hover:scale-110 hover:-rotate-12 hover:text-white hover:shadow-md'
                              >
                                 <Link href={href}>
                                    <Icon className='h-4 w-4' />
                                 </Link>
                              </Button>
                           )
                        )}
                     </div>
                  </div>

                  <h1 className='from-muted-foreground/15 bg-gradient-to-b bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl'>
                     Hyperchat
                  </h1>
               </div>
               {/* Navigation Links */}
               <div className='grid w-full grid-cols-2 items-start justify-between gap-8 px-5 lg:col-span-3'>
                  {(['product', 'company', 'resources', 'legal'] as const).map(
                     section => (
                        <div
                           key={section}
                           className='w-full'
                        >
                           <h3 className='border-primary mb-4 -ml-5 border-l-2 pl-5 text-sm font-semibold tracking-wider uppercase'>
                              {section.charAt(0).toUpperCase() +
                                 section.slice(1)}
                           </h3>
                           <ul className='space-y-3'>
                              {data().navigation[section].map(item => (
                                 <motion.li
                                    initial={{ x: -10 }}
                                    whileInView={{ x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{
                                       duration: 1.5,
                                       type: 'spring'
                                    }}
                                    key={item.name}
                                 >
                                    <Link
                                       href={item.href}
                                       className='group text-muted-foreground hover:text-foreground decoration-primary -ml-5 inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 hover:pl-5 hover:underline'
                                    >
                                       <ArrowDownLeft className='text-primary rotate-[225deg] opacity-30 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100 sm:group-hover:rotate-[225deg] md:rotate-0' />
                                       {item.name}
                                    </Link>
                                 </motion.li>
                              ))}
                           </ul>
                        </div>
                     )
                  )}
               </div>
            </div>
            {/* Bottom Section */}
            <div className='via-primary h-px w-full bg-gradient-to-r from-transparent to-transparent' />
            <div className='text-muted-foreground container m-auto flex flex-col items-center justify-between gap-4 p-4 text-xs md:flex-row md:px-0 md:text-sm'>
               <p className=''>
                  &copy; {currentYear} hyper-chat | All rights reserved
               </p>
               <div className='flex items-center gap-4'>
                  {data().bottomLinks.map(({ href, label }) => (
                     <Link
                        key={label}
                        href={href}
                        className='hover:text-foreground'
                     >
                        {label}
                     </Link>
                  ))}
               </div>
            </div>
            <span className='from-primary/20 absolute inset-x-0 bottom-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-t' />
         </div>
      </motion.footer>
   )
}
