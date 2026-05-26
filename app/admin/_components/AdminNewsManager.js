'use client';

import { useMemo, useState } from 'react';
import styles from '../Admin.module.css';

const NEWS_TYPES = ['NEWS', 'CAMPAIGN', 'RALLY'];

const emptyForm = {
  title: '',
  content: '',
  type: 'NEWS',
  imageUrl: '',
  videoUrl: '',
  isPublished: true,
};

function validateNews(form) {
  const title = form.title.trim();
  const content = form.content.trim();

  if (title.length < 5 || title.length > 140) {
    return 'Title must be between 5 and 140 characters.';
  }

  if (content.length < 20 || content.length > 5000) {
    return 'Content must be between 20 and 5000 characters.';
  }

  if (!NEWS_TYPES.includes(form.type)) {
    return 'Invalid news type.';
  }

  return null;
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export default function AdminNewsManager({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [togglingId, setTogglingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitLabel = useMemo(() => {
    if (saving) return editingId ? 'Updating...' : 'Creating...';
    return editingId ? 'Update News' : 'Create News';
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
      content: item.content || '',
      type: item.type || 'NEWS',
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      isPublished: Boolean(item.isPublished),
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateNews(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/admin/news/${editingId}` : '/api/admin/news', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await parseJson(res);

      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? data.item : item)));
        setSuccess('News updated successfully.');
      } else {
        setItems((prev) => [data.item, ...prev]);
        setSuccess('News created successfully.');
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this news item? This action cannot be undone.');
    if (!ok) return;

    setError('');
    setSuccess('');
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      await parseJson(res);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
      setSuccess('News deleted successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  }

  async function handleTogglePublish(item) {
    setError('');
    setSuccess('');
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/admin/news/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      const data = await parseJson(res);
      setItems((prev) => prev.map((current) => (current.id === item.id ? data.item : current)));
      setSuccess(data.item.isPublished ? 'News published.' : 'News unpublished.');
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId('');
    }
  }

  return (
    <div className={styles.pageStack}>
      <h1>Manage News</h1>

      <div className="card">
        <div className="card-header">
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{editingId ? 'Edit News' : 'Create News'}</h2>
        </div>
        <div className="card-body">
          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          <form className={styles.formGrid} onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="news-title">Title</label>
              <input
                id="news-title"
                className="form-input"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                maxLength={140}
                required
              />
            </div>

            <div className={styles.formGrid2}>
              <div className="form-group">
                <label className="form-label" htmlFor="news-type">Type</label>
                <select
                  id="news-type"
                  className="form-input"
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                >
                  {NEWS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '30px' }}>
                <input
                  id="news-published"
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                />
                <label htmlFor="news-published">Published</label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="news-content">Content</label>
              <textarea
                id="news-content"
                className="form-input"
                rows={6}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                required
              />
            </div>

            <div className={styles.formGrid2}>
              <div className="form-group">
                <label className="form-label" htmlFor="news-image">Image URL (optional)</label>
                <input
                  id="news-image"
                  type="url"
                  className="form-input"
                  value={form.imageUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="news-video">Video URL (optional)</label>
                <input
                  id="news-video"
                  type="url"
                  className="form-input"
                  value={form.videoUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                />
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
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>All News</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '12px' }}>
          {items.length === 0 && <p className={styles.cardMuted}>No news entries found.</p>}
          {items.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div>
                  <span className={`badge ${item.isPublished ? 'badge-active' : 'badge-pending'}`}>
                    {item.isPublished ? 'PUBLISHED' : 'UNPUBLISHED'}
                  </span>
                  <h3 style={{ margin: '8px 0 6px 0', fontSize: '1.1rem' }}>{item.title}</h3>
                  <div className={styles.metaText}>
                    {item.type} | {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className={styles.actionsRow}>
                  <button className="btn btn-outline" type="button" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    disabled={togglingId === item.id}
                  >
                    {togglingId === item.id ? 'Saving...' : item.isPublished ? 'Unpublish' : 'Publish'}
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
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
