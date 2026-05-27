'use client';

import { useMemo, useState } from 'react';
import styles from '../Admin.module.css';

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function buildQuery(filters) {
  const search = new URLSearchParams();
  if (filters.memberId) search.set('memberId', filters.memberId);
  if (filters.status) search.set('status', filters.status);
  if (filters.from) search.set('from', filters.from);
  if (filters.to) search.set('to', filters.to);
  const value = search.toString();
  return value ? `?${value}` : '';
}

export default function AdminDonationsManager({ initialItems, members }) {
  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState({ memberId: '', status: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = useMemo(
    () => items.reduce((sum, donation) => sum + Number(donation.amount || 0), 0),
    [items]
  );

  async function applyFilters() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/donations${buildQuery(filters)}`);
      const data = await parseJson(res);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetFilters() {
    const reset = { memberId: '', status: '', from: '', to: '' };
    setFilters(reset);
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/donations');
      const data = await parseJson(res);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageStack}>
      <h1>Donation Management</h1>

      <div className="card">
        <div className="card-body">
          <div className={styles.filterGrid}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="member-filter">Member</label>
              <select
                id="member-filter"
                className="form-input"
                value={filters.memberId}
                onChange={(e) => setFilters((prev) => ({ ...prev, memberId: e.target.value }))}
              >
                <option value="">All Members</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                className="form-input"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="from-filter">From Date</label>
              <input
                id="from-filter"
                type="date"
                className="form-input"
                value={filters.from}
                onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="to-filter">To Date</label>
              <input
                id="to-filter"
                type="date"
                className="form-input"
                value={filters.to}
                onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
              />
            </div>
          </div>

          <div className={styles.actionsRow} style={{ marginTop: '10px' }}>
            <button type="button" className="btn btn-primary" onClick={applyFilters} disabled={loading}>
              {loading ? 'Filtering...' : 'Apply Filters'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetFilters} disabled={loading}>
              Reset
            </button>
          </div>

          {error && <div className={styles.errorBox} style={{ marginTop: '12px' }}>{error}</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Donations</h2>
          <p className={styles.metaText} style={{ margin: '6px 0 0 0' }}>
            Count: {items.length} | Total: Rs {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="card-body">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.cardMuted}>
                      No donations found for the selected filter.
                    </td>
                  </tr>
                )}
                {items.map((donation) => (
                  <tr key={donation.id}>
                    <td>{new Date(donation.createdAt).toLocaleString()}</td>
                    <td>{donation.user?.name || 'Guest'}</td>
                    <td>{donation.user?.email || '-'}</td>
                    <td>Rs {Number(donation.amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${donation.status === 'SUCCESS' ? 'badge-active' : 'badge-pending'}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td>{donation.referenceId}</td>
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
