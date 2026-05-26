import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, serverError } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const memberId = String(searchParams.get('memberId') || '').trim();
    const status = String(searchParams.get('status') || '').trim().toUpperCase();
    const from = String(searchParams.get('from') || '').trim();
    const to = String(searchParams.get('to') || '').trim();

    const where = {};

    if (memberId) {
      where.userId = memberId;
    }

    if (status) {
      where.status = status;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (!Number.isNaN(fromDate.getTime())) {
          where.createdAt.gte = fromDate;
        }
      }
      if (to) {
        const toDate = new Date(to);
        if (!Number.isNaN(toDate.getTime())) {
          toDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = toDate;
        }
      }
      if (!where.createdAt.gte && !where.createdAt.lte) {
        delete where.createdAt;
      }
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items: donations });
  } catch (error) {
    console.error('Admin donations list error:', error);
    return serverError('Failed to fetch donations');
  }
}
