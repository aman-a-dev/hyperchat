import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch conversations where the user participates via UserConversation
    const conversations = await prisma.conversation.findMany({
      where: {
        userConversations: { some: { userId } },
      },
      include: {
        userConversations: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, content: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Enrich each conversation with unread count and the other participant
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.userConversations.find((uc) => uc.userId !== userId)?.user;
        const myUc = conv.userConversations.find((uc) => uc.userId === userId);
        const lastReadAt = myUc?.lastReadAt;
        const lastMessage = conv.messages[0] || null;

        let unreadCount = 0;
        if (lastReadAt) {
          unreadCount = await prisma.message.count({
            where: {
              conversationId: conv.id,
              senderId: { not: userId },
              createdAt: { gt: lastReadAt },
            },
          });
        } else {
          // No read record – count all messages from others
          unreadCount = await prisma.message.count({
            where: {
              conversationId: conv.id,
              senderId: { not: userId },
            },
          });
        }

        return {
          id: conv.id,
          otherUser: otherUser
            ? {
                id: otherUser.id,
                name: otherUser.name,
                email: otherUser.email,
                image: otherUser.image,
              }
            : null,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isFromMe: lastMessage.senderId === userId,
              }
            : null,
          unreadCount,
          updatedAt: conv.updatedAt,
        };
      })
    );

    // Sort by last message time (desc), fallback to conversation updatedAt
    enriched.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt?.getTime() || a.updatedAt.getTime();
      const timeB = b.lastMessage?.createdAt?.getTime() || b.updatedAt.getTime();
      return timeB - timeA;
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Check if a direct conversation already exists via UserConversation
    const existing = await prisma.userConversation.findFirst({
      where: {
        userId: session.user.id,
        conversation: {
          isGroup: false,
          userConversations: {
            some: { userId: otherUserId },
          },
        },
      },
      select: { conversationId: true },
    });

    if (existing) {
      return NextResponse.json({ conversationId: existing.conversationId });
    }

    // Create conversation and junction records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const newConversation = await tx.conversation.create({
        data: { isGroup: false },
        select: { id: true },
      });

      await tx.userConversation.createMany({
        data: [
          { userId: session.user.id, conversationId: newConversation.id, lastReadAt: new Date() },
          { userId: otherUserId, conversationId: newConversation.id, lastReadAt: new Date() },
        ],
      });

      return newConversation;
    });

    return NextResponse.json({ conversationId: result.id });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}