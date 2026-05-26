import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET(_request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing event id');

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ items: registrations });
  } catch (error) {
    console.error('Admin registrations fetch error:', error);
    return serverError('Failed to fetch registrations');
  }
}
