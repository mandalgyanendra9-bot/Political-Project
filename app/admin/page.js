import prisma from '@/lib/prisma';
import styles from './Admin.module.css';

export default async function AdminDashboard() {
  const [
    totalMembers,
    totalEvents,
    totalNews,
    totalDonationCount,
    totalDonations,
    pendingMembers,
    publishedNews,
    upcomingEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.news.count(),
    prisma.donation.count(),
    prisma.donation.aggregate({
      _sum: { amount: true },
    }),
    prisma.user.count({ where: { status: 'PENDING' } }),
    prisma.news.count({ where: { isPublished: true } }),
    prisma.event.count({ where: { date: { gte: new Date() } } }),
  ]);

  return (
    <div className={styles.pageStack}>
      <h1>Admin Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total Members</h3>
            <div className={styles.statValue}>{totalMembers}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total Events</h3>
            <div className={styles.statValue}>{totalEvents}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total News</h3>
            <div className={styles.statValue}>{totalNews}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total Donations</h3>
            <div className={styles.statValue}>{totalDonationCount}</div>
            <div className={styles.metaText}>Rs {(totalDonations._sum.amount || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ marginBottom: '8px' }}>Actionable Snapshot</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Pending member approvals: <strong>{pendingMembers}</strong>
          </p>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)' }}>
            Published news: <strong>{publishedNews}</strong>
          </p>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)' }}>
            Upcoming events: <strong>{upcomingEvents}</strong>
          </p>
          <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)' }}>
            Donations total amount: <strong>Rs {(totalDonations._sum.amount || 0).toLocaleString()}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
