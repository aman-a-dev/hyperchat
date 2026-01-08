import Features from '@/components/layout/pages/features'
import type { Metadata } from 'next'

export default function FeaturesPage() {
   return (
      <div>
         <Features />
      </div>
   )
}

export const featuresMetadata: Metadata = {
   title: 'HyperChat Features | Complete AI-Powered Chat Capabilities',
   description:
      'Explore all HyperChat features: AI message suggestions,AI image , realtime messaging, voice commands, collaboration tools, enterprise security, and more.',
   keywords: [
      'HyperChat features',
      'AI chat capabilities',
      'messaging features',
      'collaboration tools',
      'security features',
      'voice commands',
      'smart replies',
      'realtime chat features',
      'team collaboration',
      'enterprise messaging'
   ].join(', '),

   alternates: {
      canonical: 'https://hyper-chat.vercel.app/features'
   },

   other: {
      'product:brand': 'HyperChat',
      'product:category': 'Communication Software'
   }
}
