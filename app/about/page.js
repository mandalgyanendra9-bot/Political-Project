export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="section-primary section" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>About the Party</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
            Born from the grassroots, built for the future. We are dedicated to creating a society that is just, equitable, and prosperous for every citizen.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            <div className="card">
              <div className="card-body" style={{ padding: '40px' }}>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Our Mission</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', lineHeight: '1.8' }}>
                  To implement progressive policies that dismantle systemic inequalities, promote sustainable economic growth, and ensure that basic human rights—including quality education, healthcare, and clean environments—are accessible to all, not just the privileged few.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ padding: '40px' }}>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>Our Vision</h2>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', lineHeight: '1.8' }}>
                  A thriving, self-reliant nation where democratic institutions are robust, transparency is the norm, and every citizen is empowered to achieve their full potential without the barriers of caste, creed, or economic background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideology & History */}
      <section className="section section-light">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '24px', fontSize: '2.2rem' }}>Our Ideology</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            The Progressive Democratic Party (PDP) is rooted in the principles of Democratic Socialism and Secularism. We believe that true democracy goes beyond elections; it requires economic democracy where wealth is equitably distributed and workers have a say in their livelihoods.
          </p>
          <ul style={{ fontSize: '1.1rem', marginBottom: '40px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><strong>Social Justice:</strong> Active dismantling of discriminatory practices.</li>
            <li><strong>Economic Equity:</strong> Fair taxation and strong social safety nets.</li>
            <li><strong>Environmental Stewardship:</strong> Prioritizing green energy and conservation.</li>
            <li><strong>Decentralization:</strong> Empowering local panchayats and municipalities.</li>
          </ul>

          <h2 style={{ color: 'var(--primary-color)', marginBottom: '24px', fontSize: '2.2rem' }}>Our History</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            Founded in 2010 by Dr. Ananya Sharma alongside a coalition of social activists, trade union leaders, and reformist intellectuals, the PDP started as a mass movement in the central plains advocating for agrarian rights. 
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            Over the past decade, we have grown into a formidable national presence. We successfully lobbied for the historic Right to Healthcare Act in 2018 and have consistently been the leading voice against crony capitalism in the parliament.
          </p>
        </div>
      </section>
    </div>
  );
}
