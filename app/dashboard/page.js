import { getUserSession } from '@/lib/auth';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function DashboardHome() {
  const session = await getUserSession();

  const [user, latestNews, myUpcomingEvents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
    }),
    prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.eventRegistration.findMany({
      where: {
        userId: session.userId,
        event: { date: { gte: new Date() } },
      },
      include: { event: true },
      orderBy: { event: { date: 'asc' } },
      take: 2,
    }),
  ]);

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Welcome back, {user.name.split(' ')[0]}!</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Membership Status</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {user.status} Member
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Digital ID Card</h3>
            <p style={{ marginBottom: '16px' }}>Your official party membership card is ready to download.</p>
            <Link href="/dashboard/id-card" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              View & Download
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/events" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Register for upcoming rally</Link>
              <Link href="/donate" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Make a donation</Link>
              <Link href="/dashboard/notifications" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Open notifications</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Party Updates</h2>
        </div>
        <div className="card-body">
          {latestNews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No updates available right now.</p>
          ) : (
            latestNews.map((item) => (
              <div key={item.id} style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
          <div style={{ padding: '16px' }}>
            <Link href="/news" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              View All News
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Upcoming Event Notifications</h2>
        </div>
        <div className="card-body">
          {myUpcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You have no upcoming event registrations.</p>
          ) : (
            myUpcomingEvents.map((row) => (
              <div key={row.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
                <div style={{ fontWeight: 600 }}>{row.event.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {new Date(row.event.date).toLocaleString()} | {row.event.location}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
