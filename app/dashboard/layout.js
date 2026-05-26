import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import DashboardSidebar from './DashboardSidebar';
import styles from './layout.module.css';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const session = await getUserSession();
  
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar user={user} />
      <div className={styles.dashboardContent}>
        {children}
      </div>
    </div>
  );
}
