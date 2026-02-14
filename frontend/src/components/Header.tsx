import React from 'react';
import { Hexagon } from 'lucide-react';

interface HeaderProps {
    currentView: 'home' | 'how-it-works' | 'features' | 'saved' | 'suggestions';
    onViewChange: (view: 'home' | 'how-it-works' | 'features' | 'saved' | 'suggestions') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'saved', label: 'Saved Plans' },
    ];

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '1rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                    onClick={() => onViewChange('home')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                >
                    <div style={{ transition: 'transform 0.3s ease' }}>
                        <Hexagon size={28} color="#000000" strokeWidth={2.5} />
                    </div>
                    <h1 style={{
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontWeight: 900,
                        fontStyle: 'italic',
                        fontSize: '1.5rem',
                        letterSpacing: '-0.05em',
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        PocketPlan
                    </h1>
                </div>

                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id as any)}
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: currentView === item.id ? '#000000' : '#4B5563',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                                fontFamily: 'var(--font-family)'
                            }}
                        >
                            {item.label}
                        </button>
                    ))}

                    <button
                        onClick={() => onViewChange('auth' as any)}
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '0.5rem 1.25rem',
                            backgroundColor: '#000000',
                            color: 'white',
                            borderRadius: '9999px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s',
                            fontFamily: 'var(--font-family)'
                        }}
                    >
                        Get Started
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
