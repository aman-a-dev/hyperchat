import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getAblyServer } from '@/lib/ably';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params;

    // Upsert UserConversation record
    await prisma.userConversation.upsert({
      where: {
        userId_conversationId: {
          userId: session.user.id,
          conversationId,
        },
      },
      update: { lastReadAt: new Date() },
      create: {
        userId: session.user.id,
        conversationId,
        lastReadAt: new Date(),
      },
    });

    // Optionally publish to user channel to clear unread badge
    const ably = getAblyServer();
    const channel = ably.channels.get(`user:${session.user.id}`);
    await channel.publish('conversation-read', { conversationId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}