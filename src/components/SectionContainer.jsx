const SectionContainer = ({ title, subtitle, children, className = '' }) => {
  return (
    <section className={`section-container ${className}`}>
      {(title || subtitle) && (
        <div className="section-header">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="section-content">
        {children}
      </div>
    </section>
  )
}

export default SectionContainer
