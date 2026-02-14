import React, { useState } from 'react';
import { MapPin, Clock, Zap, Sparkles, Navigation } from 'lucide-react';

interface InputCardProps {
  onSearch: (data: { location: string; destination: string; time: string; preference: string; budget: string }) => void;
  isThinking: boolean;
}

const InputCard: React.FC<InputCardProps> = ({ onSearch, isThinking }) => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [time, setTime] = useState('30');
  const [preference, setPreference] = useState('');
  const [budget, setBudget] = useState('Budget');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location, destination, time, preference, budget });
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: '#F9FAFB',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    color: 'var(--color-text-main)'
  };

  const iconStyle = {
    position: 'absolute' as 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-text-muted)',
    pointerEvents: 'none' as 'none'
  };

  return (
    <div className="tilt-card" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      padding: '2.5rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      maxWidth: '480px',
      width: '100%',
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.8)',
      position: 'relative'
    }}>


      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Location Input */}
        <div style={{ position: 'relative' }}>
          <MapPin size={20} style={iconStyle} />
          <input
            type="text"
            placeholder="Starting Location (e.g. Thrissur)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            required
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Destination Input (Optional) */}
        <div style={{ position: 'relative' }}>
          <Navigation size={20} style={iconStyle} />
          <input
            type="text"
            placeholder="Destination (Optional)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Time Input */}
        <div style={{ position: 'relative' }}>
          <Clock size={20} style={iconStyle} />
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            required
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          >
            <option value="" disabled>How much time do you have?</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="120">2 Hours</option>
            <option value="180">3 Hours+</option>
          </select>
        </div>

        {/* Preference Input */}
        <div style={{ position: 'relative' }}>
          <Sparkles size={20} style={iconStyle} />
          <input
            type="text"
            placeholder="Vibe? (e.g. Chill, Outdoor, Art)"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Budget Input */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#F3F4F6', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          {['Free', 'Budget', 'Premium'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setBudget(opt.toLowerCase())}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: budget === opt.toLowerCase() ? '#FFFFFF' : 'transparent',
                color: budget === opt.toLowerCase() ? 'var(--color-primary)' : 'var(--color-text-muted)',
                boxShadow: budget === opt.toLowerCase() ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <button type="submit" disabled={isThinking} className="btn-premium" style={{
          background: 'var(--color-primary)',
          color: '#FFFFFF',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '1.05rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '0.5rem',
          cursor: isThinking ? 'not-allowed' : 'pointer',
          opacity: isThinking ? 0.9 : 1,
          boxShadow: 'var(--shadow-md)',
          border: 'none',
          width: '100%'
        }}>
          {isThinking ? (
            <>
              <span className="loader-pulse" style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%', display: 'inline-block' }}></span>
              Analyzing Context...
            </>
          ) : (
            <>
              <Zap size={18} fill="currentColor" />
              Get My PocketPlan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputCard;
