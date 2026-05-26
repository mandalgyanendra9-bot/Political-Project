import Link from 'next/link';
/* eslint-disable @next/next/no-img-element */
import prisma from '@/lib/prisma';

export default async function News() {
  const newsItems = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>News & Updates</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Latest news, press releases, and campaign updates from the Progressive Democratic Party.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
          {newsItems.length === 0 ? (
            <div className="text-center" style={{ padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
              No news updates available at the moment.
            </div>
          ) : (
            newsItems.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-active">{item.type}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--primary-color)' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-color)', marginBottom: '20px', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                  {item.imageUrl && (
                    <div style={{ marginBottom: '16px' }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', borderRadius: '10px', maxHeight: '420px', objectFit: 'cover' }} />
                    </div>
                  )}
                  {item.videoUrl && (
                    <div style={{ marginBottom: '8px' }}>
                      <a href={item.videoUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '8px 12px' }}>
                        Watch Video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
