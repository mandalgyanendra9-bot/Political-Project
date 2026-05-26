import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError } from '@/lib/admin/auth';
import { validateNewsPayload } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing news id');

    const body = await request.json();

    if (Object.keys(body).length === 1 && typeof body.isPublished === 'boolean') {
      const updated = await prisma.news.update({
        where: { id },
        data: { isPublished: body.isPublished },
      });
      return NextResponse.json({ item: updated });
    }

    const validation = validateNewsPayload(body);
    if (!validation.ok) {
      return badRequest(validation.error);
    }

    const updated = await prisma.news.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Admin news update error:', error);
    return serverError('Failed to update news');
  }
}

export async function DELETE(_request, context) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    if (!id) return badRequest('Missing news id');

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin news delete error:', error);
    return serverError('Failed to delete news');
  }
}
