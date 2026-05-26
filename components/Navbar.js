'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Leadership', path: '/leadership' },
    { name: 'News', path: '/news' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark}>PDP</div>
          <div className={styles.logoText}>
            <span className={styles.partyName}>Progressive Democratic</span>
            <span className={styles.partySub}>Party</span>
          </div>
        </Link>

        {/* Desktop Menu */}
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
            <Link href="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} />
              Login
            </Link>
            <Link href="/register" className="btn btn-primary">
              Join Now
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
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
            <Link href="/login" className="btn btn-outline" onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              Join Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
