import Hero from '@/components/layout/home/hero'
import ShowCase from '@/components/layout/home/show-case'
import LogoCloud from '@/components/layout/home/logo-cloud'
import QuickStart from '@/components/layout/home/quick-start'
import AnimatedTestimonials from '@/components/ui/testimonials'
import FAQ from '@/components/layout/home/faq'
import CTA from '@/components/layout/home/cta'
import { LiquidCursor } from '@/components/ui/liquid-cursor'

export default function HomePage() {
   return (
      <main>
         <LiquidCursor />
         <Hero />
         <LogoCloud />
         <ShowCase />
         <AnimatedTestimonials data={testimonials} />
         <QuickStart />
         <FAQ />
         <CTA />
      </main>
   )
}

const testimonials = [
   {
      name: 'Tokuma Uki',
      image: 'tg:resolve?domain=tokepictures',
      description: 'finally bro thats awesome 🥶',
      handle: '@tokepictures'
   },
   {
      name: 'Miuchan',
      image: 'https://plus.unsplash.com/premium_photo-1692340973636-6f2ff926af39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description: "it's awesome ✌️✌️✌️",
      handle: '@miuchan'
   },
   {
      name: 'Nahom Sisay',
      image: 'https://plus.unsplash.com/premium_photo-1692340973636-6f2ff926af39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description: '️😃😃😃😃😃😃',
      handle: '@ETHIOZORO1'
   },
   {
      name: 'Eyob Getachew',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description: 'K But i like it 👌',
      handle: '@Ultra_shop123'
   },
   {
      name: 'Binian',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description:
         "Okay, there are other easier and better options for this kind of thing, but it's your choice. The main thing is that it's comfortable for you. 😊👍",
      handle: '@biniamde'
   },
   {
      name: 'Rio',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description: `Wow man this is really impressive 🔥 I have never seen this kind of website before. The UI and animations feel very smooth and everything loads fast I really appreciate the effort you put into this.
One small thing I noticed the spacing and alignment in some areas could be improved a bit to make it look even cleaner and
also, I’m curious what tech stack did you use to build this?`,
      handle: 'https://t.me/Misiker_Genene'
   },
   {
      name: 'Feke',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description: `I’ve checked it, it’s really good Aman. We can meet in person.`,
      handle: '@feke_official'
   },
   {
      name: 'Elidu',
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      description: '❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️',
      handle: '@feke_official'
   }
]
