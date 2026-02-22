import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId: otherUserId } = await req.json();
    if (!otherUserId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (otherUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot start conversation with yourself' },
        { status: 400 }
      );
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        users: {
          every: { id: { in: [session.user.id, otherUserId] } },
        },
      },
      select: { id: true },
    });

    if (existingConversation) {
      return NextResponse.json({ conversationId: existingConversation.id });
    }

    const newConversation = await prisma.conversation.create({
      data: {
        isGroup: false,
        users: {
          connect: [{ id: session.user.id }, { id: otherUserId }],
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ conversationId: newConversation.id });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}