'use client';

import { useState, useCallback } from 'react';
import UserItem from './user-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Share2,
  Trash2,
  X,
  List,
  Folders,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Logo } from '@/components/icon/icons';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface User {
  id: string;
  name: string;
  email: string;
  src: string;
  online?: boolean;
  link: string;
  lastMsg: string;
  unreadCount?: number;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users = [] }: UserListProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const toggleSelectionMode = useCallback(() => {
    setIsSelecting((prev) => {
      if (!prev) setSelectedUserIds([]);
      return !prev;
    });
  }, []);

  const handleUserSelect = useCallback((id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedUserIds.length === 0) return;
    toast.success(`Deleted ${selectedUserIds.length} users`);
    setIsSelecting(false);
    setSelectedUserIds([]);
  }, [selectedUserIds]);

  const handleShare = useCallback(() => {
    if (selectedUserIds.length === 0) return;
    toast.success(`Shared ${selectedUserIds.length} users`);
    setIsSelecting(false);
    setSelectedUserIds([]);
  }, [selectedUserIds]);

  return (
    <div className="relative flex w-full flex-col justify-between h-full">
      <QuickDropDown toggleSelectionMode={toggleSelectionMode} isSelecting={isSelecting} />

      <div className="flex flex-col lg:grid lg:grid-cols-2 justify-center p-3 gap-1 mt-14">
        {
          users.map((user) => (
            <UserItem
              key={user.id}
              id={user.id}
              lastMsg={user.lastMsg}
              link={user.link}
              avatar={user.src}
              name={user.name}
              email={user.email}
              online={user.online}
              unreadCount={user.unreadCount}
              isSelecting={isSelecting}
              isSelected={selectedUserIds.includes(user.id)}
              onSelect={handleUserSelect}
            />
          ))
        }
      </div>

      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 w-[90%] left-[5%] md:w-[60%] md:left-[20%] shadow-lg z-30 flex items-center justify-around rounded-2xl bg-background/95 p-4 backdrop-blur"
          >
            <span className="text-sm font-black text-muted-foreground">{selectedUserIds.length} selected</span>
            <Button variant="ghost" size="icon" onClick={toggleSelectionMode} className="text-muted-foreground hover:bg-muted-foreground/30">
              <X size={25} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare} disabled={selectedUserIds.length === 0} className="text-muted-foreground hover:bg-muted-foreground/30">
              <Share2 size={25} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={selectedUserIds.length === 0} className="text-destructive hover:bg-destructive/30">
              <Trash2 size={25} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickDropDown({ isSelecting, toggleSelectionMode }: { isSelecting: boolean; toggleSelectionMode: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`fixed top-2 right-14 z-10 p-3 ${isSelecting ? 'hidden' : 'flex'}`}>
          <MoreVertical strokeWidth={4} className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={toggleSelectionMode} className="flex justify-between items-center">
          <span>Select Users</span>
          <List className="size-4" />
        </DropdownMenuItem>
        <Link href="/settings/category">
          <DropdownMenuItem className="flex justify-between items-center">
            <span>Categories</span>
            <Folders className="size-4" />
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}