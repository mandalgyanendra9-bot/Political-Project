import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, serverError } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const [totalMembers, totalEvents, totalNews, donationAggregate, pendingMembers] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.news.count(),
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.user.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({
      totalMembers,
      totalEvents,
      totalNews,
      totalDonationsAmount: donationAggregate._sum.amount || 0,
      pendingMembers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return serverError('Failed to fetch dashboard stats');
  }
}
