import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, Calendar, ArrowRight, Cloud } from 'lucide-react';

interface FavoriteItem {
    name: string;
    location: string;
    score: number;
    date?: string; // Mocking date if not present
    weather?: string; // Mocking weather if not present
}

interface HistoryItem {
    location: string;
    vibe: string;
    date: string;
}

const SavedPlans: React.FC = () => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Favorites
                const favRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/favorites`);
                const favData = await favRes.json();

                // Fetch History
                const histRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/history`);
                const histData = await histRes.json();

                setFavorites(favData);
                setHistory(histData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = (index: number) => {
        // In a real app, delete via API
        // For now, optimistic UI update
        const newFavs = [...favorites];
        newFavs.splice(index, 1);
        setFavorites(newFavs);
    };

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in" style={{ fontFamily: 'Inter, sans-serif', color: '#000000', maxWidth: '1200px' }}>

            {/* Page Header */}
            <div className="text-center mb-16">
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    letterSpacing: '-0.03em',
                    color: '#000000'
                }}>
                    Saved Plans & History
                </h1>
                <p style={{
                    fontSize: '1.125rem',
                    color: '#4B5563',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    View your previously saved plans and recommendation history.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* Left Column: Saved Plans */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Saved Plans <span style={{ fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500 }}>({favorites.length})</span>
                    </h2>

                    {isLoading ? (
                        <div className="animate-pulse flex flex-col gap-4">
                            {[1, 2].map(i => (
                                <div key={i} style={{ height: '160px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}></div>
                            ))}
                        </div>
                    ) : favorites.length === 0 ? (
                        <EmptyState label="No saved plans yet." />
                    ) : (
                        <div className="flex flex-col gap-5">
                            {favorites.map((fav, index) => (
                                <div key={index} style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.01)';
                                    }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', marginBottom: '0.25rem' }}>{fav.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <MapPin size={14} />
                                                <span>{fav.location || "City Center"}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                                            {fav.score}% Match
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 my-1">
                                        <div className="flex items-center gap-1.5">
                                            <Cloud size={16} />
                                            <span>Clear Sky</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} />
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-auto pt-2 border-t border-gray-100">
                                        <button style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            backgroundColor: '#000000',
                                            color: '#FFFFFF',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'opacity 0.2s'
                                        }}
                                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                        >
                                            View Again <ArrowRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #E5E7EB',
                                                backgroundColor: '#FFFFFF',
                                                color: '#EF4444',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Recent History */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent History</h2>

                    {isLoading ? (
                        <div className="animate-pulse flex flex-col gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: '80px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}></div>
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <EmptyState label="No history available." />
                    ) : (
                        <div className="flex flex-col gap-4">
                            {history.slice().reverse().slice(0, 8).map((item, index) => (
                                <div key={index} style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.02)',
                                    border: '1px solid #F3F4F6',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h4 style={{ fontWeight: 600, color: '#1F2937', marginBottom: '0.25rem' }}>{item.location}</h4>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: '#6B7280',
                                            backgroundColor: '#F3F4F6',
                                            padding: '0.125rem 0.5rem',
                                            borderRadius: '4px'
                                        }}>
                                            {item.vibe} Vibe
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const EmptyState = ({ label }: { label: string }) => (
    <div style={{
        padding: '3rem',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px dashed #E5E7EB',
        color: '#9CA3AF'
    }}>
        <p>{label}</p>
    </div>
);

export default SavedPlans;
