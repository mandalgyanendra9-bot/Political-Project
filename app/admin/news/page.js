import prisma from '@/lib/prisma';
import AdminNewsManager from '../_components/AdminNewsManager';

export default async function AdminNewsPage() {
  const newsItems = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminNewsManager initialItems={newsItems} />;
}
