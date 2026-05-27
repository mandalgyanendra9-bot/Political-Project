import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError } from '@/lib/admin/auth';
import { validateMemberStatus, validateUserRole } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing member id');

    const body = await request.json();
    const updateData = {};

    if (body.status !== undefined) {
      const parsedStatus = validateMemberStatus(body.status);
      if (!parsedStatus.ok) {
        return badRequest(parsedStatus.error);
      }
      updateData.status = parsedStatus.value;
    }

    if (body.role !== undefined) {
      const parsedRole = validateUserRole(body.role);
      if (!parsedRole.ok) {
        return badRequest(parsedRole.error);
      }
      updateData.role = parsedRole.value;
    }

    if (Object.keys(updateData).length === 0) {
      return badRequest('No valid fields to update');
    }

    if (auth.session.userId === id && updateData.role && updateData.role !== 'ADMIN') {
      return badRequest('You cannot remove your own admin role');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
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
