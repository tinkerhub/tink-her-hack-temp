import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, CheckCircle, Hexagon, CloudRain, Package, Heart } from 'lucide-react';

interface ResultCardProps {
    onBack: () => void;
    onFavorite?: () => void;
    data: {
        name: string;
        distance: string;
        duration: string;
        reason: string[];
        score?: number;
        weather?: string;
        must_take?: string[];
        alternative?: string;
        music_recommendations?: string[];
        image_url?: string;
    };
}

const ResultCard: React.FC<ResultCardProps> = ({ onBack, onFavorite, data }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={`result-card perspective-container ${mounted ? 'animate-slide-up' : ''}`} style={{
            width: '100%',
            maxWidth: '640px',
            margin: '0 auto',
            position: 'relative'
        }}>
            <div className="tilt-card" style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                transformStyle: 'preserve-3d',
                position: 'relative'
            }}>

                {/* Header Image / Gradient Placeholder */}
                <div style={{
                    height: '200px',
                    background: data.image_url ? `url(${data.image_url})` : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                }}>
                    {/* Overlay for text readability if image exists */}
                    {data.image_url && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)' }}></div>
                    )}

                    <button
                        onClick={onBack}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            backdropFilter: 'blur(4px)',
                            zIndex: 10
                        }}
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* Score Badge */}
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        lineHeight: 1,
                        zIndex: 10
                    }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.9, fontWeight: 500 }}>Vibe Match</span>
                        {data.score || 85}%
                    </div>
                </div>

                <div style={{ padding: '2rem 2rem 1.5rem', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>

                    {/* Main Content Card */}
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.5rem',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                lineHeight: 1.2
                            }}>
                                {data.name}
                            </h2>
                            <button
                                onClick={onFavorite}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}
                                title="Saved to Favorites"
                            >
                                <Heart size={22} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <MapPin size={16} /> {data.distance}
                            </div>
                            <div style={{ width: '4px', height: '4px', background: '#D1D5DB', borderRadius: '50%' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={16} /> {data.duration}
                            </div>
                        </div>

                        {/* Weather Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#F0F9FF',
                            color: '#0369A1',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem'
                        }}>
                            <CloudRain size={16} />
                            {data.weather || "Checking Weather..."}
                        </div>

                        {/* Recommendation Reasoning */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>why recommended</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {data.reason && data.reason.map((reason, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        marginBottom: '0.5rem',
                                        color: 'var(--color-text-main)',
                                        fontSize: '0.95rem',
                                        alignItems: 'flex-start'
                                    }}>
                                        <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Must Take Items */}
                        {data.must_take && data.must_take.length > 0 && (
                            <div style={{ background: '#F9FAFB', borderRadius: '8px', padding: '1rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={14} /> Don't Forget
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {data.must_take.map((item, i) => (
                                        <span key={i} style={{
                                            background: 'white',
                                            border: '1px solid var(--color-border)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                            color: 'var(--color-text-main)'
                                        }}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Music Recommendations */}
                        {data.music_recommendations && data.music_recommendations.length > 0 && (
                            <div style={{ marginTop: '1.5rem', background: '#F5F3FF', borderRadius: '8px', padding: '1rem', border: '1px solid #E0E7FF' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> Vibe Playlist
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {data.music_recommendations.map((track, i) => (
                                        <span key={i} style={{
                                            background: 'white',
                                            border: '1px solid #E0E7FF',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: '#4338CA',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem'
                                        }}>
                                            ♪ {track}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Alternative */}
                        {data.alternative && (
                            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                                Backup option: <strong>{data.alternative}</strong>
                            </div>
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    letterSpacing: '0.02em',
                }}>
                    <Hexagon size={12} strokeWidth={2.5} /> Powered by PocketPlan Intelligence™
                </div>

            </div>
        </div>
    );
};

export default ResultCard;
