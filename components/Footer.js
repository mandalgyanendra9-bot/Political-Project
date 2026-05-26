import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

const FacebookIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        <div className={styles.footerGrid}>
          {/* Brand & About */}
          <div className={styles.footerCol}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoMark}>UAP</div>
              <div className={styles.logoText}>
                <span className={styles.partyName}>Unchi Awaaj</span>
                <span className={styles.partySub}>Party</span>
              </div>
            </Link>
            <p className={styles.footerAbout}>
              Building a stronger, more prosperous nation for all citizens through progressive policies and democratic values. Join us in shaping the future.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook"><FacebookIcon size={20} /></a>
              <a href="#" aria-label="Twitter"><TwitterIcon size={20} /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon size={20} /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/leadership">Leadership Team</Link></li>
              <li><Link href="/news">News & Updates</Link></li>
              <li><Link href="/events">Events & Rallies</Link></li>
              <li><Link href="/register">Join the Party</Link></li>
              <li><Link href="/donate">Donate</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerCol}>
            <h3 className={styles.colTitle}>Contact Us</h3>
            <ul className={styles.contactInfo}>
              <li>
                <MapPin size={18} className={styles.contactIcon} />
                <span>123 National Avenue, New Delhi, India 110001</span>
              </li>
              <li>
                <Phone size={18} className={styles.contactIcon} />
                <span>+91 1800 123 4567</span>
              </li>
              <li>
                <Mail size={18} className={styles.contactIcon} />
                <span>unchiawaajparty@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={`container ${styles.bottomContainer}`}>
          <p>&copy; {new Date().getFullYear()} Unchi Awaaj Party. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
