import { getUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DonationsPage() {
  const session = await getUserSession();

  const donations = await prisma.donation.findMany({
    where: {
      userId: session.userId,
      paymentMode: 'ONLINE',
      status: 'SUCCESS',
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Donation History</h1>

      <div className="card">
        <div className="card-body">
          {donations.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
              You don&apos;t have any verified successful online donations yet.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Reference ID</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Amount</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}>{new Date(donation.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px', fontFamily: 'monospace' }}>{donation.referenceId}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)' }}>Rs {donation.amount}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="badge badge-active">{donation.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
