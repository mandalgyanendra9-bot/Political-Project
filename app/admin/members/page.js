import prisma from '@/lib/prisma';
import AdminMembersManager from '../_components/AdminMembersManager';

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { donations: true, registrations: true } } },
  });

  return <AdminMembersManager initialMembers={members} />;
}
