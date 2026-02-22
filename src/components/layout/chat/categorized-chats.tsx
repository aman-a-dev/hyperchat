'use client';

import { useState, useEffect, useCallback } from 'react';
import { SmoothTab } from '@/components/ui/smooth-tab';
import UserList from './user-list';
import { getAblyClient } from '@/lib/ably';
import { useSession } from '@/lib/auth-client';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    isFromMe: boolean;
  } | null;
  unreadCount: number;
}

export default function CategorizedChats() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time updates via Ably
  useEffect(() => {
    if (!session?.user?.id) return;

    const ably = getAblyClient();
    const channel = ably.channels.get(`user:${session.user.id}`);

    const handleNewMessage = (msg: any) => {
      const { conversationId, message } = msg.data;
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === conversationId);
        if (index === -1) {
          // New conversation – fetch again to get full details
          fetchConversations();
          return prev;
        }
        const updated = [...prev];
        const conv = { ...updated[index] };
        conv.lastMessage = {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          isFromMe: message.senderId === session.user.id,
        };
        if (message.senderId !== session.user.id) {
          conv.unreadCount += 1;
        }
        updated[index] = conv;
        // Move to top
        updated.splice(index, 1);
        updated.unshift(conv);
        return updated;
      });
    };

    const handleConversationRead = (msg: any) => {
      const { conversationId } = msg.data;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    };

    channel.subscribe('new-message', handleNewMessage);
    channel.subscribe('conversation-read', handleConversationRead);

    return () => {
      channel.unsubscribe('new-message', handleNewMessage);
      channel.unsubscribe('conversation-read', handleConversationRead);
    };
  }, [session?.user?.id, fetchConversations]);

  const categories = [{ id: 'all', title: 'All' }];
  const currentConversations = conversations;

  return (
    <div className="h-full w-full mb-16">
      {loading ? (
        <div className="flex justify-center p-8">Loading conversations...</div>
      ) : (
        <UserList
          users={currentConversations.map((c) => ({
            id: c.id,
            name: c.otherUser?.name || 'Unknown',
            email: c.otherUser?.email || '',
            src: c.otherUser?.image || '/avatar.png',
            online: false, // could be enhanced with presence
            link: `/chats/${c.id}`,
            lastMsg: c.lastMessage?.content || 'No messages yet',
            unreadCount: c.unreadCount,
          }))}
        />
      )}
      <SmoothTab
        items={categories}
        value={activeCategory}
        onChange={setActiveCategory}
      />
    </div>
  );
}