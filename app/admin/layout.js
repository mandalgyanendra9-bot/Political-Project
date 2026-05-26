import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import Link from 'next/link';
import { Users, FileText, Calendar, LayoutDashboard, Home } from 'lucide-react';

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
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--light-gray)' }}>
      {/* Admin Sidebar */}
      <div style={{ width: '280px', backgroundColor: 'var(--primary-color)', color: 'white', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h2 style={{ color: 'white', fontSize: '1.2rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin CMS</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', color: 'white', opacity: 0.9 }}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/members" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', color: 'white', opacity: 0.9 }}>
            <Users size={20} /> Members
          </Link>
          <Link href="/admin/news" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', color: 'white', opacity: 0.9 }}>
            <FileText size={20} /> News & Updates
          </Link>
          <Link href="/admin/events" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', color: 'white', opacity: 0.9 }}>
            <Calendar size={20} /> Events
          </Link>
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }}></div>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', color: 'white', opacity: 0.7 }}>
            <Home size={20} /> Exit Admin
          </Link>
        </nav>
      </div>

      {/* Admin Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
