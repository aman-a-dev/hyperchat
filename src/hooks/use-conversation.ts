import { useEffect, useState } from 'react';
import { getAblyClient } from '@/lib/ably';
import type { Message } from '@prisma/client';

export function useConversation(conversationId: string, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const ably = getAblyClient();
    const channel = ably.channels.get(`conversation:${conversationId}`);

    const onNewMessage = (msg: any) => {
      const newMessage = msg.data;
      setMessages((prev) => {
        // Prevent duplicates – if already present, ignore
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    };

    const onMessageEdited = (msg: any) => {
      const edited = msg.data;
      setMessages((prev) =>
        prev.map((m) => (m.id === edited.id ? edited : m))
      );
    };

    const onMessageDeleted = (msg: any) => {
      const { id } = msg.data;
      setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    channel.subscribe('new-message', onNewMessage);
    channel.subscribe('message-edited', onMessageEdited);
    channel.subscribe('message-deleted', onMessageDeleted);

    return () => {
      channel.unsubscribe('new-message', onNewMessage);
      channel.unsubscribe('message-edited', onMessageEdited);
      channel.unsubscribe('message-deleted', onMessageDeleted);
    };
  }, [conversationId]);

  return { messages, setMessages, loading };
}