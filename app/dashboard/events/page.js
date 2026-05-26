import { getUserSession } from '@/lib/auth';
import { Calendar, MapPin, Clock } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function MyEventsPage() {
  const session = await getUserSession();
  
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: session.userId },
    include: { event: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>My Events</h1>
      
      {registrations.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven&apos;t registered for any events yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {registrations.map(reg => (
            <div key={reg.id} className="card">
              <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '12px 16px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                {reg.status}
              </div>
              <div className="card-body">
                <h3 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>{reg.event.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} /> <span>{new Date(reg.event.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> <span>{new Date(reg.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} /> <span>{reg.event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
