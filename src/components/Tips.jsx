import { useNavigate } from 'react-router-dom'

const Tips = () => {
  const navigate = useNavigate()

  const tips = [
    {
      title: 'Stay Hydrated',
      description: 'Drink plenty of water throughout the day. Aim for 8-10 glasses daily.',
      icon: '💧',
    },
    {
      title: 'Get Adequate Sleep',
      description:
        'Sleep when baby sleeps. Aim for 7-9 hours total (including naps). Quality rest accelerates recovery.',
      icon: '😴',
    },
    {
      title: 'Balanced Nutrition',
      description:
        'Eat nutrient-rich foods including iron, calcium, and protein. Include whole grains, lean meats, and fruits.',
      icon: '🥗',
    },
    {
      title: 'Iron Intake',
      description:
        'Include iron-rich foods like spinach, red meat, beans, or fortified cereals to prevent anemia.',
      icon: '🩸',
    },
    {
      title: 'Gentle Movement',
      description:
        'Start with light walks and stretches. Consult doctor before exercise. Movement improves circulation.',
      icon: '🚶',
    },
    {
      title: 'Manage Pain',
      description:
        'Use pain management methods recommended by your doctor. Heat pads and medications can help.',
      icon: '💊',
    },
    {
      title: 'Emotional Support',
      description:
        'Connect with family, friends, or support groups. Talking about your feelings helps recovery.',
      icon: '❤️',
    },
    {
      title: 'Monitor Bleeding',
      description:
        'Track bleeding patterns. Contact doctor if bleeding increases or has foul odor.',
      icon: '📋',
    },
  ]

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Recovery Tips</h1>
          <p className="muted">You're doing great! Follow these tips for stable recovery.</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </header>

      <div className="tips-grid">
        {tips.map((tip, idx) => (
          <div key={idx} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <h3>{tip.title}</h3>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tips
