import React from 'react';

interface HeroProps {
    onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {


    return (
        <div className="hero text-center animate-fade-in flex flex-col justify-center items-center min-h-[60vh] md:min-h-[70vh] py-20" >
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '20px',
                color: '#111827',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }}></span>
                Stop searching. Start experiencing.
            </div>

            <h1 className="animate-entrance" style={{
                fontFamily: 'var(--font-family)', // Inter
                fontSize: 'clamp(4rem, 10vw, 8rem)', // Massive responsive size
                fontWeight: 900, // Extra Bold/Black
                letterSpacing: '-0.05em', // Tight spacing
                color: '#000000', // Strict Black
                marginBottom: '1rem',
                lineHeight: '0.9',
                maxWidth: '900px'
            }}>
                PocketPlan
            </h1>

            <p className="animate-entrance" style={{
                fontSize: '1.75rem',
                color: '#4B5563',
                maxWidth: '640px',
                margin: '0 auto 2.5rem',
                lineHeight: '1.4',
                fontWeight: 500,
                animationDelay: '0.1s',
                opacity: 0,
                animationFillMode: 'forwards'
            }}>
                Smarter plans. Better moments.
            </p>

            <div className="animate-fade-in-delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={onGetStarted}
                    style={{
                        backgroundColor: '#000000',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    Get Started
                </button>
                <button
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{
                        backgroundColor: '#FFFFFF',
                        color: '#111827',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        border: '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default Hero;
