import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import Link from 'next/link';
import { Users, FileText, Calendar, LayoutDashboard, Home, HandCoins } from 'lucide-react';
import styles from './Admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  const session = await getUserSession();
  
  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className={styles.adminRoot}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/members" className={styles.navLink}>
            <Users size={20} /> Members
          </Link>
          <Link href="/admin/news" className={styles.navLink}>
            <FileText size={20} /> News & Updates
          </Link>
          <Link href="/admin/events" className={styles.navLink}>
            <Calendar size={20} /> Events
          </Link>
          <Link href="/admin/donations" className={styles.navLink}>
            <HandCoins size={20} /> Donations
          </Link>
          <div className={styles.navSeparator} />
          <Link href="/dashboard" className={styles.navLink}>
            <Home size={20} /> Exit Admin
          </Link>
        </nav>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
