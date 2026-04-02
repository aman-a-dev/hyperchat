import { useEffect, useState, useCallback } from 'react';
import { getAblyClient } from '@/lib/ably';

// Local Message type (matches Prisma schema fields used in this hook)
interface Message {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  edited: boolean;
  editedAt: Date | null;
  isAI: boolean;
  repliedToId: string | null;
  forwardedFromId: string | null;
  type: string;
  senderId: string;
  conversationId: string;
}

interface UseConversationOptions {
  autoFetch?: boolean;
  onConnectionChange?: (state: string) => void;
}

export function useConversation(
  conversationId: string,
  initialMessages: Message[] = [],
  options: UseConversationOptions = {}
) {
  const { autoFetch = false, onConnectionChange } = options;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<string>('initialized');

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (autoFetch) fetchMessages();
  }, [autoFetch, fetchMessages]);

  useEffect(() => {
    if (!conversationId) return;

    const ably = getAblyClient();
    const channel = ably.channels.get(`conversation:${conversationId}`);

    const onConnectionChangeHandler = (stateChange: any) => {
      setConnectionState(stateChange.current);
      onConnectionChange?.(stateChange.current);
    };

    // 'state' is a valid Ably event, but TypeScript types may not include it.
    // Use a type assertion to bypass the type check.
    ably.connection.on('state' as any, onConnectionChangeHandler);

    const onNewMessage = (msg: any) => {
      const newMessage = msg.data as Message;
      setMessages((prev) => (prev.some(m => m.id === newMessage.id) ? prev : [...prev, newMessage]));
    };

    const onMessageEdited = (msg: any) => {
      const edited = msg.data as Message;
      setMessages((prev) => prev.map(m => (m.id === edited.id ? edited : m)));
    };

    const onMessageDeleted = (msg: any) => {
      const { id } = msg.data as { id: string };
      setMessages((prev) => prev.filter(m => m.id !== id));
    };

    channel.subscribe('new-message', onNewMessage);
    channel.subscribe('message-edited', onMessageEdited);
    channel.subscribe('message-deleted', onMessageDeleted);

    return () => {
      channel.unsubscribe('new-message', onNewMessage);
      channel.unsubscribe('message-edited', onMessageEdited);
      channel.unsubscribe('message-deleted', onMessageDeleted);
      ably.connection.off('state' as any, onConnectionChangeHandler);
    };
  }, [conversationId, onConnectionChange]);

  return { messages, setMessages, loading, error, connectionState, refetch: fetchMessages };
}