import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, serverError } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            donations: true,
            registrations: true,
          },
        },
      },
    });

    return NextResponse.json({ items: members });
  } catch (error) {
    console.error('Admin members list error:', error);
    return serverError('Failed to fetch members');
  }
}
