'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';
import styles from './Navbar.module.css';

function getSessionActions(role) {
  if (role === 'ADMIN') {
    return {
      primary: { label: 'Admin Panel', href: '/admin' },
      showLogin: false,
      showJoinNow: false,
      isAuthenticated: true,
    };
  }

  if (role === 'MEMBER') {
    return {
      primary: { label: 'Dashboard', href: '/dashboard' },
      showLogin: false,
      showJoinNow: false,
      isAuthenticated: true,
    };
  }

  return {
    primary: null,
    showLogin: true,
    showJoinNow: true,
    isAuthenticated: false,
  };
}

export default function NavbarClient({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'News', path: '/news' },
    { name: 'Events', path: '/events' },
  ];

  const sessionActions = useMemo(() => getSessionActions(role), [role]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsOpen(false);
      router.push('/');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const desktopActionStyle = { display: 'flex', alignItems: 'center', gap: '8px' };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark}>UAP</div>
          <div className={styles.logoText}>
            <span className={styles.partyName}>Unchi Awaaj</span>
            <span className={styles.partySub}>Party</span>
          </div>
        </Link>

        <div className={styles.desktopMenu}>
          <ul className={styles.navItems}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            <Link href="/donate" className="btn btn-secondary">
              Donate
            </Link>

            {sessionActions.primary && (
              <Link href={sessionActions.primary.href} className="btn btn-outline" style={desktopActionStyle}>
                <User size={18} />
                {sessionActions.primary.label}
              </Link>
            )}

            {sessionActions.showLogin && (
              <Link href="/login" className="btn btn-outline" style={desktopActionStyle}>
                <User size={18} />
                Login
              </Link>
            )}

            {sessionActions.showJoinNow && (
              <Link href="/register" className="btn btn-primary">
                Join Now
              </Link>
            )}

            {sessionActions.isAuthenticated && (
              <button
                type="button"
                className="btn btn-primary"
                style={desktopActionStyle}
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut size={18} />
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>
        </div>

        <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileNavItems}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`${styles.mobileNavLink} ${pathname === link.path ? styles.active : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileNavActions}>
            <Link href="/donate" className="btn btn-secondary" onClick={() => setIsOpen(false)}>
              Donate
            </Link>

            {sessionActions.primary && (
              <Link href={sessionActions.primary.href} className="btn btn-outline" onClick={() => setIsOpen(false)}>
                {sessionActions.primary.label}
              </Link>
            )}

            {sessionActions.showLogin && (
              <Link href="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}

            {sessionActions.showJoinNow && (
              <Link href="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                Join Now
              </Link>
            )}

            {sessionActions.isAuthenticated && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
