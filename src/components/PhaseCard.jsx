const PhaseCard = ({ 
  phaseNumber, 
  title, 
  description, 
  duration, 
  children,
  actionLabel = 'Start Session',
  onAction = null
}) => {
  const phaseClass = `phase-card-premium phase-${phaseNumber}`

  return (
    <div className={phaseClass}>
      <div className="phase-card-header">
        <div className="phase-badge">
          Phase {phaseNumber}
        </div>
        <h2 className="phase-card-title">{title}</h2>
        <p className="phase-card-duration">
          <span className="duration-icon">⏱</span> {duration}
        </p>
      </div>
      
      <p className="phase-card-description">
        {description}
      </p>

      <div className="phase-card-content">
        {children}
      </div>
    </div>
  )
}

export default PhaseCard
