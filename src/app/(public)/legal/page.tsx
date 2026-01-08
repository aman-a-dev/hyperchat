import React from 'react'
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Briefcase } from 'lucide-react'
import type { Metadata } from 'next'

export default function LegalPage() {
   return (
      <div className='container mx-auto py-10 max-w-4xl px-4 my-6'>
         <div className='mb-10 text-center'>
            <Badge
               variant='outline'
               className='border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium'
            >
               <Briefcase className='text-primary mr-1 h-3.5 w-3.5' />
               Legal
            </Badge>
            <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl my-3'>
               Legal Center
            </h1>
            <p className='mt-2 text-muted-foreground'>
               The rules, data policies, and terms for Hyper-Chat.
            </p>
         </div>

         <Tabs
            defaultValue='privacy'
            className='w-full'
         >
            <TabsList className='grid w-full grid-cols-3'>
               <TabsTrigger value='privacy'>Privacy Policy</TabsTrigger>
               <TabsTrigger value='terms'>Terms of Service</TabsTrigger>
               <TabsTrigger value='cookies'>Cookie Policy</TabsTrigger>
            </TabsList>

            {/* Privacy Policy Tab */}
            <TabsContent value='privacy'>
               <Card>
                  <CardHeader>
                     <CardTitle>Privacy Policy</CardTitle>
                     <CardDescription>
                        Last updated: {new Date().toLocaleDateString()}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6 text-sm leading-relaxed'>
                     <p>
                        At Hyper-Chat, we take your privacy seriously. This
                        policy outlines how we collect, use, and protect your
                        personal information within our real-time AI-powered
                        chat application.
                     </p>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           1. Data We Collect
                        </h3>
                        <p className='mb-4 text-muted-foreground'>
                           To provide our services, we collect the following
                           specific data points:
                        </p>
                        <ul className='ml-6 list-disc space-y-2'>
                           <li>
                              <strong>Name:</strong> The display name you choose
                              for your identity in chats.
                           </li>
                           <li>
                              <strong>Email:</strong> Used for account
                              verification and communication.
                           </li>
                           <li>
                              <strong>Password (Optional):</strong> If you
                              register via email, your password is stored
                              securely. This field is optional if you log in via
                              third-party providers (e.g., Google, GitHub).
                           </li>
                           <li>
                              <strong>Profiles:</strong> Your public profile
                              settings and preferences.
                           </li>
                           <li>
                              <strong>Bio:</strong> The short biography you
                              write to describe yourself.
                           </li>
                           <li>
                              <strong>Job:</strong> The job title you choose to
                              display on your profile.
                           </li>
                           <li>
                              <strong>Joined At:</strong> The timestamp of when
                              you created your account.
                           </li>
                        </ul>
                     </div>

                     <Separator />

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           2. AI Data Usage
                        </h3>
                        <p>
                           Hyper-Chat is powered by Artificial Intelligence. We
                           may process your chat inputs to generate responses.
                           We do not use your private conversations to train our
                           public models without your explicit consent.
                        </p>
                     </div>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           3. Data Security
                        </h3>
                        <p>
                           We implement industry-standard encryption to protect
                           your data. However, please remember that no method of
                           transmission over the Internet is 100% secure.
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Terms of Service Tab */}
            <TabsContent value='terms'>
               <Card>
                  <CardHeader>
                     <CardTitle>Terms of Service</CardTitle>
                     <CardDescription>
                        Rules and guidelines for using Hyper-Chat.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6 text-sm leading-relaxed'>
                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           1. Introduction to Hyper-Chat
                        </h3>
                        <p>
                           Welcome to Hyper-Chat. By accessing our real-time
                           chat application, you agree to be bound by these
                           Terms. Hyper-Chat is a cutting-edge messaging
                           platform powered by advanced AI to facilitate
                           seamless communication.
                        </p>
                     </div>

                     <Separator />

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           2. Acceptable Use Policy
                        </h3>
                        <p className='mb-2'>
                           You agree not to use Hyper-Chat to:
                        </p>
                        <ul className='ml-6 list-disc space-y-1'>
                           <li>
                              Transmit viruses, malware, or malicious code.
                           </li>
                           <li>
                              Harass, abuse, or harm other users in real-time
                              chats.
                           </li>
                           <li>
                              Use the AI features to generate illegal content,
                              hate speech, or sexually explicit material.
                           </li>
                           <li>
                              Attempt to reverse engineer the AI algorithms.
                           </li>
                        </ul>
                     </div>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           3. AI Disclaimer
                        </h3>
                        <p>
                           Hyper-Chat utilizes Artificial Intelligence to assist
                           in communication. AI responses may not always be
                           accurate or appropriate. You should not rely on AI
                           advice for medical, legal, or financial decisions. We
                           are not liable for errors made by the AI.
                        </p>
                     </div>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           4. Termination
                        </h3>
                        <p>
                           We reserve the right to suspend or terminate your
                           account if you violate these terms, particularly if
                           you misuse the AI capabilities or harass other users.
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            {/* Cookie Policy Tab */}
            <TabsContent value='cookies'>
               <Card>
                  <CardHeader>
                     <CardTitle>Cookie Policy</CardTitle>
                     <CardDescription>
                        How Hyper-Chat uses cookies and tracking technologies.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6 text-sm leading-relaxed'>
                     <p>
                        To ensure the real-time functionality of Hyper-Chat
                        works correctly, we use cookies and similar
                        technologies.
                     </p>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           1. Essential Cookies
                        </h3>
                        <p>
                           These are strictly necessary for the operation of the
                           app. Without them, you cannot stay logged in or use
                           the real-time chat features.
                        </p>
                     </div>

                     <Separator />

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           2. Functional Cookies
                        </h3>
                        <p>
                           These allow us to remember your preferences, such as
                           your theme (Dark/Light mode) and notification
                           settings.
                        </p>
                     </div>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           3. Analytics Cookies
                        </h3>
                        <p>
                           We use these to understand how users interact with
                           the AI features and the chat interface to improve
                           performance.
                        </p>
                     </div>

                     <div>
                        <h3 className='mb-2 text-lg font-semibold text-foreground'>
                           4. Managing Cookies
                        </h3>
                        <p>
                           You can disable cookies through your browser
                           settings, but please note that doing so may prevent
                           the real-time chat and AI features from working
                           correctly.
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   )
}

export const legalMetadata: Metadata = {
   title: 'Legal | Terms of Service, Privacy Policy & Compliance',
   description:
      'HyperChat legal documents including Terms of Service, Privacy Policy, Cookie Policy, Data Processing Agreement, and compliance information.',
   keywords: [
      'HyperChat terms of service',
      'privacy policy',
      'legal documents',
      'cookie policy',
      'data processing agreement',
      'compliance',
      'GDPR',
      'CCPA',
      'legal terms',
      'user agreement'
   ].join(', '),


   alternates: {
      canonical: 'https://hyper-chat.vercel.app/legal'
   },

   robots: {
      index: false,
      follow: true,
      googleBot: {
         index: false,
         follow: true
      }
   },

   other: {
      'legal:document_type': 'terms_of_service',
      'legal:effective_date': '2024-01-01',
      'dc.language': 'en',
      'dc.publisher': 'HyperChat'
   }
}
