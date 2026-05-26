'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, CreditCard, Bell, LogOut, LayoutDashboard, Calendar, Heart } from 'lucide-react';
import styles from './DashboardSidebar.module.css';

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Profile', path: '/dashboard/profile', icon: <User size={20} /> },
    { name: 'My Events', path: '/dashboard/events', icon: <Calendar size={20} /> },
    { name: 'Donation History', path: '/dashboard/donations', icon: <Heart size={20} /> },
    { name: 'Digital ID Card', path: '/dashboard/id-card', icon: <CreditCard size={20} /> },
    { name: 'Notifications', path: '/dashboard/notifications', icon: <Bell size={20} /> },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {user.photoUrl ? (
            <img src={user.photoUrl} alt={user.name} />
          ) : (
            <User size={32} color="white" />
          )}
        </div>
        <div className={styles.userDetails}>
          <h3 className={styles.userName}>{user.name}</h3>
          <span className={`badge ${user.status === 'ACTIVE' ? 'badge-active' : 'badge-pending'}`}>
            {user.status}
          </span>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.logoutWrapper}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
