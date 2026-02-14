import React from 'react';
import { MapPin, CloudSun, BrainCircuit } from 'lucide-react';

const IntelligenceIndicators: React.FC = () => {
    const columnStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        textAlign: 'left' as const,
        gap: '0.75rem',
        flex: 1,
        padding: '1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
        opacity: 0,
        animationFillMode: 'forwards'
    };

    const iconContainerStyle = {
        color: 'var(--color-primary)',
        backgroundColor: '#F3F4F6', // Light gray background for icon
        padding: '0.75rem',
        borderRadius: '10px',
        display: 'inline-flex'
    };

    const titleStyle = {
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--color-text-main)',
        letterSpacing: '-0.01em'
    };

    const descStyle = {
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
        lineHeight: '1.5'
    };

    return (
        <div className="animate-fade-in-delay-2" style={{
            width: '100%',
            maxWidth: '1000px',
            margin: '4rem auto 2rem',
            padding: '0 1rem'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '2.5rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                How It Works
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
            }}>
                <div className="hover-glow-border" style={{ ...columnStyle, animation: 'fadeIn 0.6s ease-out 0.2s forwards' }}>
                    <div style={iconContainerStyle}>
                        <MapPin size={22} strokeWidth={2} />
                    </div>
                    <div style={titleStyle}>Location Intelligence</div>
                    <div style={descStyle}>Detects your real-time position to find hidden gems nearby instantly.</div>
                </div>

                <div className="hover-glow-border" style={{ ...columnStyle, animation: 'fadeIn 0.6s ease-out 0.4s forwards' }}>
                    <div style={iconContainerStyle}>
                        <CloudSun size={22} strokeWidth={2} />
                    </div>
                    <div style={titleStyle}>Weather Awareness</div>
                    <div style={descStyle}>Adapts recommendations dynamically based on current forecast conditions.</div>
                </div>

                <div className="hover-glow-border" style={{ ...columnStyle, animation: 'fadeIn 0.6s ease-out 0.6s forwards' }}>
                    <div style={iconContainerStyle}>
                        <BrainCircuit size={22} strokeWidth={2} />
                    </div>
                    <div style={titleStyle}>Smart Scoring Engine</div>
                    <div style={descStyle}>Ranks activities using contextual data to match your exact vibe.</div>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceIndicators;
