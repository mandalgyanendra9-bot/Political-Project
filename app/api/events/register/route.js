import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, date: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.date < new Date()) {
      return NextResponse.json({ error: 'Registration closed for this event' }, { status: 400 });
    }

    // Check if already registered
    const existing = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: session.userId,
          eventId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        userId: session.userId,
        eventId: event.id,
      }
    });

    return NextResponse.json({ success: true, registration });

  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 });
  }
}
