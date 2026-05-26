import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Megaphone } from 'lucide-react';
import styles from './page.module.css';
import prisma from '@/lib/prisma';

export default async function Home() {
  const [latestNews, upcomingEvents] = await Promise.all([
    prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 1,
    }),
  ]);

  const announcements = [
    ...latestNews.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.content,
      date: new Date(item.createdAt).toLocaleDateString(),
      href: '/news',
      icon: <Megaphone size={16} />,
    })),
    ...upcomingEvents.map((event) => ({
      id: event.id,
      title: event.title,
      excerpt: `${event.description} (${event.location})`,
      date: new Date(event.date).toLocaleDateString(),
      href: '/events',
      icon: <Calendar size={16} />,
    })),
  ].slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroSlogan}>Building a Stronger, Prosperous Nation Together</h1>
          <p className={styles.heroDescription}>
            Join the Progressive Democratic Party in our mission to bring positive change, uphold democratic values, and ensure justice for all citizens.
          </p>
          <div className={styles.heroActions}>
            <Link href="/register" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
              Join Now
            </Link>
            <Link href="/about" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '14px 28px', fontSize: '1.1rem' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Leader Section */}
      <section className={styles.leaderSection}>
        <div className={`container ${styles.leaderGrid}`}>
          <div className={styles.leaderImage}>
            <Image 
              src="/leader.png" 
              alt="Dr. Ananya Sharma - PDP National President" 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.leaderInfo}>
            <h2 className={styles.leaderName}>Dr. Ananya Sharma</h2>
            <div className={styles.leaderTitle}>Founder & National President</div>
            <p className={styles.leaderQuote}>
              &quot;True progress is only achieved when the weakest among us are empowered to stand tall. Our fight is for equality, transparency, and sustainable development.&quot;
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Dr. Sharma has dedicated over 20 years to public service, leading grassroots movements that have shaped national policies on education and healthcare.
            </p>
            <Link href="/leadership" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Meet the Team <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className={styles.announcementsSection}>
        <div className="container">
          <h2 className="section-title">Latest Announcements</h2>
          <p className="section-subtitle">Stay updated with our recent activities and upcoming campaigns.</p>
          
          <div className={styles.announcementsGrid}>
            {announcements.length === 0 ? (
              <div className={styles.announcementCard}>
                <h3 className={styles.announcementTitle}>Announcements Coming Soon</h3>
                <p>Latest party updates will appear here as soon as they are published.</p>
                <Link href="/news" style={{ color: 'var(--secondary-color)', fontWeight: '600', marginTop: '12px', display: 'inline-block' }}>
                  Visit News Center &rarr;
                </Link>
              </div>
            ) : (
              announcements.map((item) => (
                <div key={item.id} className={styles.announcementCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-color)' }}>
                    {item.icon}
                    <span className={styles.announcementDate}>{item.date}</span>
                  </div>
                  <h3 className={styles.announcementTitle}>{item.title}</h3>
                  <p>{item.excerpt.slice(0, 140)}{item.excerpt.length > 140 ? '...' : ''}</p>
                  <Link href={item.href} style={{ color: 'var(--secondary-color)', fontWeight: '600', marginTop: '12px', display: 'inline-block' }}>
                    Read More &rarr;
                  </Link>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link href="/news" className="btn btn-outline">
              View All Updates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
