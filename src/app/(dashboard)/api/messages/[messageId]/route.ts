import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getAblyServer } from '@/lib/ably';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messageId } = await params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: { select: { id: true } } },
    });

    if (!message || message.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    await prisma.message.delete({ where: { id: messageId } });

    const ably = getAblyServer();
    const channel = ably.channels.get(`conversation:${message.conversationId}`);
    await channel.publish('message-deleted', { id: messageId, conversationId: message.conversationId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messageId } = await params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: { select: { id: true } } },
    });

    if (!message || message.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { content, edited: true, editedAt: new Date() },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        repliedTo: { select: { id: true, content: true, sender: { select: { name: true } } } },
      },
    });

    const ably = getAblyServer();
    const channel = ably.channels.get(`conversation:${message.conversationId}`);
    await channel.publish('message-edited', updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}