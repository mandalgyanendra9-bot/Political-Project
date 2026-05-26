import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError } from '@/lib/admin/auth';
import { validateEventPayload } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json({ items: events });
  } catch (error) {
    console.error('Admin events list error:', error);
    return serverError('Failed to fetch events');
  }
}

export async function POST(request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const validation = validateEventPayload(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    const created = await prisma.event.create({ data: validation.data });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    console.error('Admin event create error:', error);
    return serverError('Failed to create event');
  }
}
