import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const totalMembers = await prisma.user.count();
  const totalEvents = await prisma.event.count();
  const totalNews = await prisma.news.count();
  const totalDonations = await prisma.donation.aggregate({
    _sum: { amount: true },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total Members</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalMembers}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total Events</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalEvents}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total News</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{totalNews}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '8px' }}>Total Donations</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              Rs {totalDonations._sum.amount || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
