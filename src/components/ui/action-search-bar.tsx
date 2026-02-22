'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import useDebounce from '@/hooks/use-debounce';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  bio?: string | null;
  job?: string | null;
  country?: string | null;
}

interface ChatSearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onOpen?: () => void;
}

const ANIMATION = {
  overlay: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  },
  card: {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  },
  item: {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  },
};

export default function ChatSearchBar({
  query,
  setQuery,
  onOpen,
}: ChatSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch users from the new API endpoint
  useEffect(() => {
    if (!debouncedQuery) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user-search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!users.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % users.length);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + users.length) % users.length);
      }

      if (e.key === 'Enter' && users[activeIndex]) {
        // Navigate to the selected user
        window.location.href = `/${users[activeIndex].email.split('@')[0]}`; // adjust as needed
        setIsOpen(false);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [users, activeIndex]
  );

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setUsers([]);
      setActiveIndex(-1);
    }
  }, [isOpen, setQuery]);

  // Clear query
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => {
          setIsOpen(true);
          onOpen?.();
        }}
        className="p-2 rounded-full hover:bg-muted/80 transition-colors"
        aria-label="Search users"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/20 backdrop-blur-sm"
            variants={ANIMATION.overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
              variants={ANIMATION.card}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="relative border-b border-border/50">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  autoFocus
                  placeholder="Search by name or email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 bg-transparent pl-10 pr-10 h-14 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {query && (
                  <button
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/80 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Hint */}
              <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/50">
                Search by name or email
              </div>

              {/* Results area */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}

                {!loading && query && users.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground text-center py-8"
                  >
                    No users found
                  </motion.p>
                )}

                {!loading && !query && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground text-center py-8"
                  >
                    Start typing to search
                  </motion.p>
                )}

                <motion.div className="space-y-1">
                  {users.map((user, idx) => (
                    <Link
                      key={user.id}
                      href={`/${user.email.split('@')[0]}`} // adjust route as needed
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        variants={ANIMATION.item}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: idx * 0.03 }}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                          idx === activeIndex
                            ? 'bg-muted/80'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarImage src={user.image ?? ''} />
                            <AvatarFallback>
                              {user.name[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                            {(user.bio || user.job || user.country) && (
                              <p className="text-xs text-muted-foreground/70 truncate">
                                {[user.bio, user.job, user.country]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-2">
                          Chat
                        </Button>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}