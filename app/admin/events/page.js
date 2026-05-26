import { createEvent, deleteEvent } from '@/lib/actions';
import prisma from '@/lib/prisma';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Manage Events</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Create New Event</h2>
        </div>
        <div className="card-body">
          <form action={createEvent}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Title</label>
              <input id="title" name="title" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea id="description" name="description" className="form-input" rows={4} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">Date & Time</label>
              <input id="date" name="date" type="datetime-local" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Location</label>
              <input id="location" name="location" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="registrationUrl">External Registration URL (optional)</label>
              <input id="registrationUrl" name="registrationUrl" type="url" className="form-input" />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input id="isOnline" name="isOnline" type="checkbox" />
              <label htmlFor="isOnline" style={{ margin: 0 }}>Online event</label>
            </div>

            <button type="submit" className="btn btn-primary">Create Event</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>All Events</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '14px' }}>
          {events.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No events available.</p>}
          {events.map((event) => (
            <div key={event.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{event.title}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(event.date).toLocaleString()} | {event.location}
                  </div>
                </div>
                <form action={deleteEvent.bind(null, event.id)}>
                  <button type="submit" className="btn btn-outline" style={{ padding: '8px 12px' }}>
                    Delete
                  </button>
                </form>
              </div>
              <p style={{ marginBottom: '8px' }}>{event.description}</p>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {event.isOnline ? 'Online' : 'In-person'} | Registrations: {event._count.registrations}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
