import Image from 'next/image';

const leadershipSections = [
  {
    title: 'President',
    members: [
      {
        name: 'Dr. Ananya Sharma',
        role: 'National President & Founder',
        bio: 'Public policy reformer with 20+ years of grassroots leadership and social justice campaigns.',
        image: '/leader.png',
      },
    ],
  },
  {
    title: 'Vice President',
    members: [
      {
        name: 'Rajiv Menon',
        role: 'National Vice President',
        bio: 'Veteran labor-rights advocate focused on employment security and fair wages.',
      },
    ],
  },
  {
    title: 'State Leaders',
    members: [
      {
        name: 'Dr. Tariq Ahmed',
        role: 'State President, North Region',
        bio: 'Healthcare reform specialist leading rural clinic outreach across multiple districts.',
      },
      {
        name: 'Kavita Desai',
        role: 'State President, West Region',
        bio: 'Environment and sustainability strategist driving green infrastructure campaigns.',
      },
    ],
  },
  {
    title: 'District Team',
    members: [
      {
        name: 'Sunita Verma',
        role: 'District Coordinator - Jaipur',
        bio: 'Leads local membership drives and women empowerment initiatives.',
      },
      {
        name: 'Amanpreet Singh',
        role: 'District Coordinator - Ludhiana',
        bio: 'Coordinates youth engagement programs and volunteer operations.',
      },
      {
        name: 'Rahul Nair',
        role: 'District Coordinator - Kochi',
        bio: 'Manages civic campaigns and community welfare partnerships.',
      },
    ],
  },
];

export default function Leadership() {
  return (
    <div className="section section-light" style={{ minHeight: 'calc(100vh - 400px)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Leadership Team</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto' }}>
            Visionary leadership at national, state, and district levels working together for accountable governance.
          </p>
        </div>

        {leadershipSections.map((section) => (
          <section key={section.title} style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '16px' }}>{section.title}</h2>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {section.members.map((member) => (
                <div key={member.name} className="card">
                  <div className="card-body">
                    {member.image && (
                      <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                        <Image src={member.image} alt={member.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                    <h3 style={{ marginBottom: '6px' }}>{member.name}</h3>
                    <div style={{ color: 'var(--secondary-color)', fontWeight: 600, marginBottom: '8px' }}>{member.role}</div>
                    <p style={{ margin: 0 }}>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
