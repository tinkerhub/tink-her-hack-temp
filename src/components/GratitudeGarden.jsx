const GratitudeGarden = ({ sessions }) => {
  return (
    <div className="gratitude-card">
      <div className="gratitude-header">
        <h3 className="gratitude-title">Your Gratitude Garden</h3>
        <div className="gratitude-count-badge">{sessions.length} sessions</div>
      </div>

      {sessions.length === 0 ? (
        <div className="gratitude-empty">
          <div className="empty-sprout">🌱</div>
          <p className="empty-message">
            Your garden begins with your first breathing session. 
            Start today and watch your flowers bloom!
          </p>
        </div>
      ) : (
        <div className="gratitude-grid">
          {sessions.map((session) => (
            <div key={session.id} className="flower-item" role="img" aria-label="flower">
              🌸
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GratitudeGarden
