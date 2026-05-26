import { Calendar, MapPin, Clock } from 'lucide-react';
import EventRegisterClient from './EventRegisterClient';
import prisma from '@/lib/prisma';

export default async function Events() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: {
      date: {
        gte: new Date()
      }
    }
  });

  return (
    <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Upcoming Events & Rallies</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Join our events across the country to participate in discussions, rallies, and community drives.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {events.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
              No upcoming events at the moment. Please check back later.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    {event.isOnline ? 'Online Event' : 'In-Person'}
                  </span>
                </div>
                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--primary-color)' }}>{event.title}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{event.description}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-color)' }}>
                      <Calendar size={18} color="var(--secondary-color)" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-color)' }}>
                      <Clock size={18} color="var(--secondary-color)" />
                      <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-color)' }}>
                      <MapPin size={18} color="var(--secondary-color)" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <EventRegisterClient eventId={event.id} />
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ width: '100%', marginTop: '10px' }}
                    >
                      External Registration Link
                    </a>
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
