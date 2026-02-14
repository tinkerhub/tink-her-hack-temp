const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Mother Heaven
            <span className="hero-emoji">🌿</span>
          </h1>
          <p className="hero-subtitle">
            Structured support for emotional and physical healing during your recovery.
          </p>
          <p className="hero-description">
            Track your daily wellness, practice mindfulness, and celebrate your progress with our 
            three-phase recovery program designed specifically for postpartum mothers.
          </p>
        </div>
        <div className="hero-image">
          <img 
            src="https://img.freepik.com/free-photo/mother-with-her-baby-girl-home_1303-29021.jpg?w=360" 
            alt="Mother holding baby"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
