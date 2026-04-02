import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      console.log('❌ GET /api/conversations: No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`🔍 GET /api/conversations: Fetching for user ${userId}`);

    const conversations = await prisma.conversation.findMany({
      where: { userConversations: { some: { userId } } },
      include: {
        userConversations: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, content: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    console.log(`📦 Raw conversations count: ${conversations.length}`);
    conversations.forEach(conv => {
      const participantIds = conv.userConversations.map(uc => uc.userId);
      console.log(`Conversation ${conv.id} participants:`, participantIds);
    });

    const enriched = await Promise.all(
      conversations.map(async conv => {
        const otherUser = conv.userConversations.find(uc => uc.userId !== userId)?.user;
        const myUc = conv.userConversations.find(uc => uc.userId === userId);
        const lastReadAt = myUc?.lastReadAt;
        const lastMessage = conv.messages[0] || null;

        let unreadCount = 0;
        if (lastReadAt) {
          unreadCount = await prisma.message.count({
            where: { conversationId: conv.id, senderId: { not: userId }, createdAt: { gt: lastReadAt } },
          });
        } else {
          unreadCount = await prisma.message.count({
            where: { conversationId: conv.id, senderId: { not: userId } },
          });
        }

        return {
          id: conv.id,
          otherUser: otherUser ? { id: otherUser.id, name: otherUser.name, email: otherUser.email, image: otherUser.image } : null,
          lastMessage: lastMessage ? { id: lastMessage.id, content: lastMessage.content, createdAt: lastMessage.createdAt, isFromMe: lastMessage.senderId === userId } : null,
          unreadCount,
          updatedAt: conv.updatedAt,
        };
      })
    );

    enriched.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt?.getTime() || a.updatedAt.getTime();
      const timeB = b.lastMessage?.createdAt?.getTime() || b.updatedAt.getTime();
      return timeB - timeA;
    });

    console.log(`✨ Returning ${enriched.length} enriched conversations`);
    return NextResponse.json(enriched);
  } catch (error) {
    console.error('🔥 Error fetching conversations:', error);
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
    if (!otherUserId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    if (otherUserId === session.user.id) {
      return NextResponse.json({ error: 'Cannot start conversation with yourself' }, { status: 400 });
    }

    console.log(`🔍 POST /api/conversations: Creating between ${session.user.id} and ${otherUserId}`);

    const existing = await prisma.userConversation.findFirst({
      where: {
        userId: session.user.id,
        conversation: { isGroup: false, userConversations: { some: { userId: otherUserId } } },
      },
      select: { conversationId: true },
    });

    if (existing) {
      console.log(`✅ Existing conversation found: ${existing.conversationId}`);
      return NextResponse.json({ conversationId: existing.conversationId });
    }

    const result = await prisma.$transaction(async tx => {
      const newConversation = await tx.conversation.create({ data: { isGroup: false }, select: { id: true } });
      await tx.userConversation.createMany({
        data: [
          { userId: session.user.id, conversationId: newConversation.id, lastReadAt: new Date() },
          { userId: otherUserId, conversationId: newConversation.id, lastReadAt: new Date() },
        ],
      });
      return newConversation;
    });

    console.log(`✅ Created new conversation: ${result.id}`);
    return NextResponse.json({ conversationId: result.id });
  } catch (error) {
    console.error('🔥 Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}