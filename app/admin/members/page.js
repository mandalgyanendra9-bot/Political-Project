import prisma from '@/lib/prisma';
import AdminMembersManager from '../_components/AdminMembersManager';
import { getUserSession } from '@/lib/auth';

export default async function AdminMembersPage() {
  const [members, session] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { donations: true, registrations: true } } },
    }),
    getUserSession(),
  ]);

  return <AdminMembersManager initialMembers={members} currentUserId={session?.userId || ''} />;
}
