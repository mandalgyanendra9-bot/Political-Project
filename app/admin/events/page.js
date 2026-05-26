import prisma from '@/lib/prisma';
import AdminEventsManager from '../_components/AdminEventsManager';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { _count: { select: { registrations: true } } },
  });

  return <AdminEventsManager initialItems={events} />;
}
