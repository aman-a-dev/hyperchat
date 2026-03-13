// src/components/layout/chat/chat-room.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MsgInput from "@/components/layout/chat/msg-input";
import Message from "@/components/layout/chat/message";
import ChatRoomNav from "@/components/layout/chat/chat-room-nav";
import { useConversation } from "@/hooks/use-conversation";
import { useSession } from "@/lib/auth-client";
import { randomHiEmoji } from "@/lib/utils";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface MessageType {
  id: string;
  content: string;
  senderId: string;
  sender?: {
    id: string;
    name: string;
    image: string | null;
    email?: string;
  };
  createdAt: Date;
  type?: string;
  edited?: boolean;
  updatedAt?: Date;
  editedAt?: Date;
  isAI?: boolean;
  repliedToId?: string;
  forwardedFromId?: string;
  conversationId?: string;
}

export default function ChatRoom() {
  const params = useParams();
  const conversationId = params.chatId as string;
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    messages: hookMessages,
    setMessages: setHookMessages,
    loading,
  } = useConversation(conversationId);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState<string>("");

  // Sync with hook messages
  useEffect(() => {
    setMessages(hookMessages);
  }, [hookMessages]);

  // Mark conversation as read when entering
  useEffect(() => {
    if (!conversationId) return;
    fetch(`/api/conversations/${conversationId}/read`, {
      method: "POST",
    }).catch(console.error);
  }, [conversationId]);

  // Fetch initial messages
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/conversations/${conversationId}/messages`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMessages(data);
        setHookMessages(data);
      } catch (error: any) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, [conversationId, setHookMessages]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !userId) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const optimisticMessage: MessageType = {
      id: tempId,
      content: messageInput,
      senderId: userId,
      sender: {
        id: userId,
        name: session?.user?.name || "You",
        image: null,
        email: session?.user?.email,
      },
      createdAt: new Date(),
      type: "TEXT",
      edited: false,
    };

    // Add optimistic message
    setMessages((prev) => [...prev, optimisticMessage]);
    setHookMessages((prev) => [...prev, optimisticMessage as any]);
    setMessageInput("");

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageInput }),
      });
      if (!res.ok) throw new Error("Send failed");
      const sentMessage = await res.json();

      setMessages((prev) => {
        // Remove the temporary optimistic message
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        // Add the real message only if it's not already present
        if (!withoutTemp.some((m) => m.id === sentMessage.id)) {
          return [...withoutTemp, sentMessage];
        }
        return withoutTemp;
      });

      setHookMessages((prev) => {
        const withoutTemp = prev.filter((m: any) => m.id !== tempId);
        if (!withoutTemp.some((m: any) => m.id === sentMessage.id)) {
          return [...withoutTemp, sentMessage];
        }
        return withoutTemp;
      });
    } catch (error: any) {
      console.error("Send error", error);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setHookMessages((prev) => prev.filter((m: any) => m.id !== tempId));
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!newContent?.trim()) return;
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Edit failed:", res.status, errorText);
        throw new Error("Edit failed");
      }
      const updated = await res.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? updated : m)),
      );
      setHookMessages((prev) =>
        prev.map((m: any) => (m.id === messageId ? updated : m)),
      );
    } catch (error: any) {
      console.error("Edit error", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setHookMessages((prev) => prev.filter((m: any) => m.id !== messageId));
    } catch (error: any) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="flex flex-col justify-center p-3 mt-5 min-h-screen">
      <ChatRoomNav />
      <div className="md:m-0 pt-5 pb-64 md:pb-52 overflow-y-scroll">
        <ul>
          {messages.length < 1 ? (
            <Empty className="border border-dashed border-4 py-10 px-10 mt-10 w-max mx-auto">
              <EmptyHeader>
                <EmptyTitle>No message yet.</EmptyTitle>
                <EmptyDescription>Say hi</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <h1
                  className="text-9xl cursor-pointer"
                  onClick={() => {
                    setMessageInput(randomHiEmoji());
                  }}
                >
                  {randomHiEmoji()}
                </h1>
              </EmptyContent>
            </Empty>
          ) : (
            messages.map((msg) => (
              <Message
                key={msg.id}
                id={msg.id}
                sender={msg.senderId === userId ? "user" : "other"}
                url={`/${msg.sender?.name?.split(" ")[0] || ""}`}
                content={msg.content}
                timestamp={new Date(msg.createdAt)}
                onEdit={
                  msg.senderId === userId && !msg.id.startsWith("temp-")
                    ? (newContent: string) =>
                        handleEditMessage(msg.id, newContent)
                    : undefined
                }
                onDelete={
                  msg.senderId === userId && !msg.id.startsWith("temp-")
                    ? () => handleDeleteMessage(msg.id)
                    : undefined
                }
              />
            ))
          )}
        </ul>

        <MsgInput
          message={messageInput}
          setMessage={setMessageInput}
          onSend={handleSendMsg}
        />

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
