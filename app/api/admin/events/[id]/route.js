import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError } from '@/lib/admin/auth';
import { validateEventPayload } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing event id');

    const body = await request.json();
    const validation = validateEventPayload(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    const updated = await prisma.event.update({
      where: { id },
      data: validation.data,
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Admin event update error:', error);
    return serverError('Failed to update event');
  }
}

export async function DELETE(_request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing event id');

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin event delete error:', error);
    return serverError('Failed to delete event');
  }
}
