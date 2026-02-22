'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { authClient } from '@/lib/auth-client';
import {
  MapPin,
  MoreHorizontal,
  MessageCircle,
  Briefcase,
  Pencil,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FadeUp from '@/animation/fade-up';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  job: string | null;
  country: string | null;
}

interface ProfileViewProps {
  user: UserProfile;
  isOwner: boolean;
}

export default function ProfileView({ user, isOwner }: ProfileViewProps) {
  const router = useRouter();

  const handleChatClick = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server responded with:', res.status, errorText);
        return;
      }
      const { conversationId } = await res.json();
      router.push(`/chats/${conversationId}`);
    } catch (error) {
      console.error('Failed to create conversation', error);
    }
  };

  return (
    <FadeUp>
      <div className='h-5' role='img' aria-label='Profile cover background' />
      <div className='container max-w-4xl mx-auto px-4 sm:px-6 pb-6'>
        {/* Profile Header */}
        <div className='relative -mt-8 sm:-mt-8 mb-6 sm:mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between'>
          <div className='flex items-end gap-4 sm:gap-6'>
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='relative'
            >
              <div className='h-30 w-30 sm:h-35 sm:w-35 overflow-hidden rounded-[30%/30%] border-4 border-background bg-background shadow-xl'>
                <Avatar className='h-full w-full rounded-[30%/30%]'>
                  <AvatarImage src={user.avatar || ''} alt={user.name} className='object-cover' />
                  <AvatarFallback className='text-2xl sm:text-4xl'>
                    {user.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='absolute bottom-1 right-1 sm:bottom-2 sm:right-2 h-6 w-6 rounded-2xl border-4 border-background bg-primary' />
            </motion.div>

            <div className='mb-1 sm:mb-2 space-y-0.5 sm:space-y-1'>
              <h1 className='text-xl sm:text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                {user.name}
              </h1>
              <p className='text-sm sm:text-base text-muted-foreground'>{user.email}</p>
            </div>
          </div>

          <div className='flex w-full gap-2 sm:gap-3 md:w-auto md:mb-2'>
            <Button onClick={handleChatClick} className={cn('flex-1 md:flex-none gap-2 transition-all')}>
              <MessageCircle className='h-4 w-4' />
              {isOwner ? 'Chat' : 'Message'}
            </Button>

            {isOwner && (
              <>
                <Link href='/settings/account'>
                  <Button variant='outline' className='flex-1 md:flex-none' aria-label='Edit profile'>
                    <Pencil />
                    Edit
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='border border-border/40' aria-label='More profile options'>
                      <MoreHorizontal className='h-4 w-4' aria-hidden='true' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className='text-xs text-muted-foreground'>
                      More
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className='bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800' />

                    <Link href='/settings'>
                      <DropdownMenuItem>
                        <Settings />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <button onClick={() => authClient.signOut()} className='w-full'>
                      <DropdownMenuItem>
                        <LogOut />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Bio & Stats */}
        <section aria-label='User bio and statistics' className='grid gap-8 md:grid-cols-[2fr,1fr]'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <p className='text-sm sm:text-base leading-relaxed text-foreground/90'>
                {user.bio || '-'}
              </p>

              <div className='flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground'>
                {user.country && (
                  <div className='flex items-center gap-1.5'>
                    <MapPin className='h-3.5 w-3.5 sm:h-4 sm:w-4' aria-hidden='true' />
                    <span>{user.country}</span>
                  </div>
                )}
                {user.job && (
                  <div className='flex items-center gap-1.5'>
                    <Briefcase className='h-3.5 w-3.5 sm:h-4 sm:w-4' aria-hidden='true' />
                    <span>{user.job}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </FadeUp>
  );
}