import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError } from '@/lib/admin/auth';
import { validateMemberStatus } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing member id');

    const body = await request.json();
    const parsedStatus = validateMemberStatus(body.status);

    if (!parsedStatus.ok) {
      return badRequest(parsedStatus.error);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status: parsedStatus.value },
      include: {
        _count: {
          select: {
            donations: true,
            registrations: true,
          },
        },
      },
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Admin member status update error:', error);
    return serverError('Failed to update member status');
  }
}
