'use client';

import { useMemo, useState } from 'react';
import styles from '../Admin.module.css';

const STATUS_OPTIONS = ['PENDING', 'ACTIVE', 'REJECTED'];

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function statusBadgeClass(status) {
  if (status === 'ACTIVE') return 'badge-active';
  return 'badge-pending';
}

export default function AdminMembersManager({ initialMembers }) {
  const [members, setMembers] = useState(initialMembers);
  const [savingId, setSavingId] = useState('');
  const [statusMap, setStatusMap] = useState(() =>
    initialMembers.reduce((acc, member) => {
      acc[member.id] = member.status;
      return acc;
    }, {})
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pendingCount = useMemo(
    () => members.filter((member) => member.status === 'PENDING').length,
    [members]
  );

  async function saveStatus(memberId, nextStatus) {
    setError('');
    setSuccess('');
    setSavingId(memberId);

    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await parseJson(res);
      setMembers((prev) => prev.map((member) => (member.id === memberId ? data.item : member)));
      setStatusMap((prev) => ({ ...prev, [memberId]: data.item.status }));
      setSuccess('Member status updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId('');
    }
  }

  return (
    <div className={styles.pageStack}>
      <h1>Member Management</h1>
      <p className={styles.metaText}>Pending approvals: {pendingCount}</p>

      {error && <div className={styles.errorBox}>{error}</div>}
      {success && <div className={styles.successBox}>{success}</div>}

      <div className="card">
        <div className="card-body">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Donations</th>
                  <th>Events</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>
                      <div>{member.email}</div>
                      <div className={styles.metaText}>{member.mobile}</div>
                    </td>
                    <td>{member.role}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass(member.status)}`}>{member.status}</span>
                    </td>
                    <td>{member._count?.donations || 0}</td>
                    <td>{member._count?.registrations || 0}</td>
                    <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actionsRow}>
                        <select
                          className="form-input"
                          value={statusMap[member.id] || member.status}
                          onChange={(e) => setStatusMap((prev) => ({ ...prev, [member.id]: e.target.value }))}
                          style={{ minWidth: '120px', padding: '8px 10px' }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => saveStatus(member.id, statusMap[member.id] || member.status)}
                          disabled={savingId === member.id}
                          style={{ padding: '8px 12px' }}
                        >
                          {savingId === member.id ? 'Saving...' : 'Save'}
                        </button>

                        <button
                          className="btn btn-outline"
                          type="button"
                          onClick={() => saveStatus(member.id, 'ACTIVE')}
                          disabled={savingId === member.id}
                          style={{ padding: '8px 12px' }}
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-outline"
                          type="button"
                          onClick={() => saveStatus(member.id, 'REJECTED')}
                          disabled={savingId === member.id}
                          style={{ padding: '8px 12px' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
