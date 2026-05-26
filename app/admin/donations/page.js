import prisma from '@/lib/prisma';
import AdminDonationsManager from '../_components/AdminDonationsManager';

export const dynamic = 'force-dynamic';

export default async function AdminDonationsPage() {
  const [donations, members] = await Promise.all([
    prisma.donation.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return <AdminDonationsManager initialItems={donations} members={members} />;
}
