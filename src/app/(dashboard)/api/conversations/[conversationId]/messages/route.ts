import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getAblyServer } from '@/lib/ably';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const before = searchParams.get('before');

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, users: { some: { id: session.user.id } } },
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      take: limit,
      ...(before && { cursor: { id: before }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        repliedTo: { select: { id: true, content: true, sender: { select: { name: true } } } },
        forwardedFrom: { select: { id: true, content: true } },
      },
    });

    return NextResponse.json(messages.reverse());
  } catch (error) {
    console.error('GET messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    const { content, type = 'TEXT', repliedToId } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, users: { some: { id: session.user.id } } },
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        type,
        senderId: session.user.id,
        conversationId,
        ...(repliedToId && { repliedToId }),
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        repliedTo: { select: { id: true, content: true, sender: { select: { name: true } } } },
      },
    });

    const ably = getAblyServer();
    const channel = ably.channels.get(`conversation:${conversationId}`);
    await channel.publish('new-message', message);

    return NextResponse.json(message);
  } catch (error) {
    console.error('POST message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}