'use client'

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion, useInView, type Variants } from 'framer-motion'
import { Code, Globe, Lock, Shield, Sparkles, Zap, Brain } from 'lucide-react'
import { useRef } from 'react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Replies',
    description: 'Generate context-aware, human-like responses in real time.'
  },
  {
    icon: Zap,
    title: 'Instant Messaging',
    description: 'Low-latency chat with messages delivered in milliseconds.'
  },
  {
    icon: Shield,
    title: 'End-to-End Encryption',
    description: 'Secure conversations with enterprise-grade encryption.'
  },
  {
    icon: Globe,
    title: 'Real-Time Collaboration',
    description: 'Share chats across devices and teams with live syncing.'
  },
  {
    icon: Lock,
    title: 'Private & Compliant',
    description: 'Built with privacy by design and compliance in mind.'
  },
  {
    icon: Sparkles,
    title: 'Smart Features',
    description: 'Message summaries, autocomplete, and smart suggestions built-in.'
  }
]


export default function Features() {
   const ref = useRef(null)
   const isInView = useInView(ref, { once: true, margin: '-50px' })

   const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
         }
      }
   }

   const itemVariants: Variants = {
      hidden: { opacity: 0, y: 30, scale: 0.9 },
      visible: {
         opacity: 1,
         y: 0,
         scale: 1,
         transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
         }
      }
   }

   return (
      <div
         ref={ref}
         className='w-full px-4 py-16'
      >
         <div className='mx-auto max-w-6xl'>
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
               transition={{ duration: 0.6 }}
               className='mb-12 text-center'
            >
               <Badge
                  variant='outline'
                  className='border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium'
               >
                  <Globe className='text-primary mr-1 h-3.5 w-3.5' />
                  Features
               </Badge>
               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  className='from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent my-5 sm:text-5xl'
               >
                  Why Choose Us
               </motion.h1>
               <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  className='text-muted-foreground mt-4 text-xl'
               >
                  Everything you need to build amazing applications
               </motion.p>
            </motion.div>

            <motion.div
               variants={containerVariants}
               initial='hidden'
               animate={isInView ? 'visible' : 'hidden'}
               className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
            >
               {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                     <motion.div
                        key={feature.title}
                        variants={itemVariants}
                     >
                        <Card className='h-full  bg-[var(--card-bg)] transition-all hover:shadow-lg'>
                           <CardHeader>
                              <motion.div
                                 initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                    rotate: -60
                                 }}
                                 animate={
                                    isInView
                                       ? { opacity: 1, scale: 1, rotate: 0 }
                                       : { opacity: 0, scale: 0.8, rotate: -60 }
                                 }
                                 transition={{
                                    delay: index * 0.1 + 0.3,
                                    type: 'spring',
                                    stiffness: 120,
                                    damping: 18,
                                    mass: 0.6
                                 }}
                                 className='mb-4 inline-flex'
                              >
                                 <Icon
                                    className='h-6 w-6 text-[var(--muted-foreground)]'
                                    aria-hidden='true'
                                 />
                              </motion.div>
                              <CardTitle className='text-xl'>
                                 {feature.title}
                              </CardTitle>
                           </CardHeader>
                           <CardContent>
                              <CardDescription className='text-base'>
                                 {feature.description}
                              </CardDescription>
                           </CardContent>
                        </Card>
                     </motion.div>
                  )
               })}
            </motion.div>
         </div>
      </div>
   )
}
