import { getUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function NotificationsPage() {
  const session = await getUserSession();

  const [newsItems, myUpcomingEvents] = await Promise.all([
    prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.eventRegistration.findMany({
      where: {
        userId: session.userId,
        event: {
          date: { gte: new Date() },
        },
      },
      include: { event: true },
      orderBy: { event: { date: 'asc' } },
      take: 5,
    }),
  ]);

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Notifications</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>My Event Notifications</h2>
        </div>
        <div className="card-body">
          {myUpcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No upcoming event registrations yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {myUpcomingEvents.map((item) => (
                <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 600 }}>{item.event.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(item.event.date).toLocaleString()} | {item.event.location}
                  </div>
                  <div style={{ marginTop: '6px' }} className="badge badge-active">{item.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Latest Party Updates</h2>
        </div>
        <div className="card-body">
          {newsItems.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No updates available.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {newsItems.map((item) => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div className="badge badge-active" style={{ marginBottom: '6px' }}>{item.type}</div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
