import { createNews, deleteNews } from '@/lib/actions';
import prisma from '@/lib/prisma';

export default async function AdminNewsPage() {
  const newsItems = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Manage News & Updates</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Create Announcement</h2>
        </div>
        <div className="card-body">
          <form action={createNews}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Title</label>
              <input id="title" name="title" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="type">Type</label>
              <select id="type" name="type" className="form-input" defaultValue="NEWS">
                <option value="NEWS">News</option>
                <option value="CAMPAIGN">Campaign Update</option>
                <option value="RALLY">Rally Details</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">Content</label>
              <textarea id="content" name="content" className="form-input" rows={5} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">Photo URL (optional)</label>
              <input id="imageUrl" name="imageUrl" type="url" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="videoUrl">Video URL (optional)</label>
              <input id="videoUrl" name="videoUrl" type="url" className="form-input" />
            </div>

            <button type="submit" className="btn btn-primary">Publish Update</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Published Updates</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '16px' }}>
          {newsItems.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No news published yet.</p>}
          {newsItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div className="badge badge-active" style={{ marginBottom: '8px' }}>{item.type}</div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{item.title}</h3>
                </div>
                <form action={deleteNews.bind(null, item.id)}>
                  <button type="submit" className="btn btn-outline" style={{ padding: '8px 12px' }}>
                    Delete
                  </button>
                </form>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{item.content}</p>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Published: {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
