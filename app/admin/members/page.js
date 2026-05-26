import prisma from '@/lib/prisma';
import { updateMemberStatus } from '@/lib/actions';

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { donations: true, registrations: true } } },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Manage Members</h1>

      <div className="card">
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Contact</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Donations</th>
                <th style={{ padding: '12px' }}>Events</th>
                <th style={{ padding: '12px' }}>Joined</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>{member.name}</td>
                  <td style={{ padding: '12px' }}>
                    <div>{member.email}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{member.mobile}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{member.role}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${member.status === 'ACTIVE' ? 'badge-active' : 'badge-pending'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{member._count.donations}</td>
                  <td style={{ padding: '12px' }}>{member._count.registrations}</td>
                  <td style={{ padding: '12px' }}>{new Date(member.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <form action={updateMemberStatus} style={{ display: 'flex', gap: '8px' }}>
                      <input type="hidden" name="id" value={member.id} />
                      <select name="status" defaultValue={member.status} className="form-input" style={{ minWidth: '110px', padding: '8px 10px' }}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                      </select>
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
