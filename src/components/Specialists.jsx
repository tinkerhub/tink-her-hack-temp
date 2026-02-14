import { useNavigate } from 'react-router-dom'

const Specialists = () => {
  const navigate = useNavigate()

  const specialists = [
    {
      type: 'Doctor',
      name: 'Dr. Sarah Johnson',
      specialty: 'Postpartum Care',
      phone: '+1-555-0101',
      email: 'sarah@healthcenter.com',
      available: 'Mon-Fri, 9AM-5PM',
    },
    {
      type: 'Doctor',
      name: 'Dr. Michael Chen',
      specialty: 'Maternal Health',
      phone: '+1-555-0102',
      email: 'michael@healthcenter.com',
      available: 'Tue-Thu, 10AM-6PM',
    },
    {
      type: 'Nutritionist',
      name: 'Emma Brown, RD',
      specialty: 'Postpartum Nutrition',
      phone: '+1-555-0201',
      email: 'emma@nutrition.com',
      available: 'Mon-Wed, 8AM-4PM',
    },
    {
      type: 'Nutritionist',
      name: 'Lisa Martinez, RD',
      specialty: 'Iron & Recovery',
      phone: '+1-555-0202',
      email: 'lisa@nutrition.com',
      available: 'Wed-Fri, 1PM-5PM',
    },
    {
      type: 'Psychologist',
      name: 'Dr. James Wilson',
      specialty: 'Postpartum Mental Health',
      phone: '+1-555-0301',
      email: 'james@therapy.com',
      available: 'Mon-Sat, 9AM-7PM',
    },
    {
      type: 'Psychologist',
      name: 'Dr. Rachel Lee',
      specialty: 'Anxiety & Support',
      phone: '+1-555-0302',
      email: 'rachel@therapy.com',
      available: 'Tue-Thu, 11AM-8PM',
    },
  ]

  const groupedSpecialists = {
    Doctor: specialists.filter((s) => s.type === 'Doctor'),
    Nutritionist: specialists.filter((s) => s.type === 'Nutritionist'),
    Psychologist: specialists.filter((s) => s.type === 'Psychologist'),
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Consult Specialists</h1>
          <p className="muted">Connect with healthcare providers for personalized care.</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </header>

      <div className="specialists-grid">
        {Object.entries(groupedSpecialists).map(([type, providers]) => (
          <div key={type} className="specialist-section">
            <h2>{type}s</h2>
            <div className="provider-list">
              {providers.map((provider, idx) => (
                <div key={idx} className="provider-card">
                  <div className="provider-header">
                    <h3>{provider.name}</h3>
                    <span className="provider-type">{provider.specialty}</span>
                  </div>
                  <div className="provider-details">
                    <p>
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${provider.phone}`}>{provider.phone}</a>
                    </p>
                    <p>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${provider.email}`}>{provider.email}</a>
                    </p>
                    <p>
                      <strong>Available:</strong> {provider.available}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Specialists
