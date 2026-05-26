'use client';

import { useMemo, useState } from 'react';
import styles from '../Admin.module.css';

const emptyForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  registrationUrl: '',
  isOnline: false,
};

function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offsetMs = date.getTimezoneOffset() * 60_000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().slice(0, 16);
}

function validateEvent(form) {
  const title = form.title.trim();
  const description = form.description.trim();
  const location = form.location.trim();

  if (title.length < 5 || title.length > 140) return 'Title must be between 5 and 140 characters.';
  if (description.length < 20 || description.length > 3000) return 'Description must be between 20 and 3000 characters.';
  if (location.length < 3 || location.length > 180) return 'Location must be between 3 and 180 characters.';
  if (!form.date || Number.isNaN(new Date(form.date).getTime())) return 'Enter a valid date and time.';
  return null;
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export default function AdminEventsManager({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [openRegistrations, setOpenRegistrations] = useState({});
  const [loadingRegistrations, setLoadingRegistrations] = useState('');
  const [regErrors, setRegErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitLabel = useMemo(() => {
    if (saving) return editingId ? 'Updating...' : 'Creating...';
    return editingId ? 'Update Event' : 'Create Event';
  }, [saving, editingId]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(item) {
    setError('');
    setSuccess('');
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      date: toDatetimeLocal(item.date),
      location: item.location || '',
      registrationUrl: item.registrationUrl || '',
      isOnline: Boolean(item.isOnline),
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateEvent(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/admin/events/${editingId}` : '/api/admin/events', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await parseJson(res);

      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? data.item : item)));
        setSuccess('Event updated successfully.');
      } else {
        setItems((prev) => [...prev, data.item].sort((a, b) => new Date(a.date) - new Date(b.date)));
        setSuccess('Event created successfully.');
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this event? Registrations linked to it will also be removed.');
    if (!ok) return;

    setError('');
    setSuccess('');
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      await parseJson(res);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setOpenRegistrations((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (editingId === id) resetForm();
      setSuccess('Event deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  }

  async function toggleRegistrations(eventId) {
    if (openRegistrations[eventId]) {
      setOpenRegistrations((prev) => ({ ...prev, [eventId]: null }));
      return;
    }

    setLoadingRegistrations(eventId);
    setRegErrors((prev) => ({ ...prev, [eventId]: '' }));

    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations`);
      const data = await parseJson(res);
      setOpenRegistrations((prev) => ({ ...prev, [eventId]: data.items }));
    } catch (err) {
      setRegErrors((prev) => ({ ...prev, [eventId]: err.message }));
    } finally {
      setLoadingRegistrations('');
    }
  }

  return (
    <div className={styles.pageStack}>
      <h1>Manage Events</h1>

      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{editingId ? 'Edit Event' : 'Create Event'}</h2>
        </div>
        <div className="card-body">
          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="event-title">Title</label>
              <input
                id="event-title"
                className="form-input"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                maxLength={140}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-description">Description</label>
              <textarea
                id="event-description"
                className="form-input"
                rows={5}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className={styles.formGrid2}>
              <div className="form-group">
                <label className="form-label" htmlFor="event-date">Date & Time</label>
                <input
                  id="event-date"
                  type="datetime-local"
                  className="form-input"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="event-location">Location</label>
                <input
                  id="event-location"
                  className="form-input"
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className={styles.formGrid2}>
              <div className="form-group">
                <label className="form-label" htmlFor="event-reg-url">External Registration URL</label>
                <input
                  id="event-reg-url"
                  type="url"
                  className="form-input"
                  value={form.registrationUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, registrationUrl: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '30px' }}>
                <input
                  id="event-online"
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) => setForm((prev) => ({ ...prev, isOnline: e.target.checked }))}
                />
                <label htmlFor="event-online">Online event</label>
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {submitLabel}
              </button>
              {editingId && (
                <button className="btn btn-outline" type="button" onClick={resetForm} disabled={saving}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>All Events</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '12px' }}>
          {items.length === 0 && <p className={styles.cardMuted}>No events found.</p>}

          {items.map((item) => {
            const registrations = openRegistrations[item.id];
            return (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h3>
                    <div className={styles.metaText}>
                      {new Date(item.date).toLocaleString()} | {item.location} | {item.isOnline ? 'Online' : 'In-person'}
                    </div>
                    <div className={styles.metaText}>Registrations: {item._count?.registrations || 0}</div>
                  </div>

                  <div className={styles.actionsRow}>
                    <button className="btn btn-outline" type="button" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-outline" type="button" onClick={() => toggleRegistrations(item.id)}>
                      {registrations ? 'Hide Registrations' : 'View Registrations'}
                    </button>
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>

                <p style={{ whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{item.description}</p>

                {loadingRegistrations === item.id && <div className={styles.inlineLoader}>Loading registrations...</div>}
                {regErrors[item.id] && <div className={styles.errorBox}>{regErrors[item.id]}</div>}

                {Array.isArray(registrations) && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Status</th>
                          <th>Registered At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.length === 0 && (
                          <tr>
                            <td colSpan={5} className={styles.cardMuted}>
                              No registrations yet.
                            </td>
                          </tr>
                        )}
                        {registrations.map((reg) => (
                          <tr key={reg.id}>
                            <td>{reg.user?.name || 'Unknown'}</td>
                            <td>{reg.user?.email || '-'}</td>
                            <td>{reg.user?.mobile || '-'}</td>
                            <td>{reg.status}</td>
                            <td>{new Date(reg.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
