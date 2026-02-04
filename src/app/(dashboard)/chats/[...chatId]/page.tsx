import ChatRoom from "@/components/layout/chat/chat-room";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { chatId } = await params;

  return (
    <div>
      <ChatRoom chat-room-id={chatId} />
    </div>
  );
}
