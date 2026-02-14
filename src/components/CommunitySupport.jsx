import React, { useState, useEffect } from 'react';
import axios from '../config/api';

const CommunitySupport = ({ user }) => {
    const [helpers, setHelpers] = useState([]);
    const [isHelper, setIsHelper] = useState(false);
    const [helperData, setHelperData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [bio, setBio] = useState('');
    const [registering, setRegistering] = useState(false);

    useEffect(() => {
        fetchHelperStatus();
        fetchHelpers();
    }, []);

    const fetchHelperStatus = async () => {
        try {
            const res = await axios.get(`/api/helpers/status/${user.id}`);
            setIsHelper(res.data.isHelper);
            setHelperData(res.data.helperData);
            if (res.data.helperData) {
                setBio(res.data.helperData.bio || '');
            }
        } catch (err) {
            console.error('Error fetching helper status:', err);
        }
    };

    const fetchHelpers = async () => {
        try {
            const res = await axios.get('/api/helpers');
            // Filter out current user from helpers list
            const filteredHelpers = res.data.helpers.filter(h => h.user_id !== user.id);
            setHelpers(filteredHelpers);
        } catch (err) {
            console.error('Error fetching helpers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterAsHelper = async () => {
        setRegistering(true);

        // Try to get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    await registerHelper(location);
                },
                async (error) => {
                    console.log('Location not available, registering without location');
                    await registerHelper(null);
                }
            );
        } else {
            await registerHelper(null);
        }
    };

    const registerHelper = async (location) => {
        try {
            await axios.post('/api/helpers/register', {
                userId: user.id,
                username: user.username,
                bio: bio,
                location: location
            });
            alert('✅ You are now a community helper!');
            setShowRegisterForm(false);
            await fetchHelperStatus();
            await fetchHelpers();
        } catch (err) {
            console.error('Error registering as helper:', err);
            alert('Failed to register. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    const handleToggleAvailability = async () => {
        try {
            const newAvailability = !helperData.available;
            await axios.put('/api/helpers/availability', {
                userId: user.id,
                available: newAvailability
            });
            alert(`Availability updated to ${newAvailability ? 'Available' : 'Unavailable'}`);
            await fetchHelperStatus();
            await fetchHelpers();
        } catch (err) {
            console.error('Error updating availability:', err);
            alert('Failed to update availability.');
        }
    };

    const handleRemoveHelper = async () => {
        if (!window.confirm('Are you sure you want to remove yourself as a helper?')) {
            return;
        }

        try {
            await axios.delete(`/api/helpers/${user.id}`);
            alert('You have been removed as a helper.');
            await fetchHelperStatus();
            await fetchHelpers();
        } catch (err) {
            console.error('Error removing helper:', err);
            alert('Failed to remove helper status.');
        }
    };

    return (
        <div className="card community-support-card">
            <h3>💝 Community Support</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                Connect with verified helpers in your community who can provide support.
            </p>

            {/* Helper Status Section */}
            {isHelper ? (
                <div className="helper-status-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-color)' }}>
                                ✨ You are a Helper
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#999' }}>
                                Status: {helperData?.available ? '🟢 Available' : '🔴 Unavailable'}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleAvailability}
                            style={{
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                borderRadius: '8px',
                                border: '1px solid var(--primary-color)',
                                background: 'white',
                                color: 'var(--primary-color)',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Toggle
                        </button>
                    </div>
                    {helperData?.bio && (
                        <p style={{
                            margin: '10px 0 0 0',
                            fontSize: '0.85rem',
                            color: '#666',
                            fontStyle: 'italic'
                        }}>
                            "{helperData.bio}"
                        </p>
                    )}
                    <button
                        onClick={handleRemoveHelper}
                        style={{
                            marginTop: '10px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#ffebee',
                            color: '#c62828',
                            cursor: 'pointer'
                        }}
                    >
                        Remove Helper Status
                    </button>
                </div>
            ) : showRegisterForm ? (
                <div className="register-helper-form">
                    <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Become a Helper</h4>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell others how you can help (optional)..."
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '0.9rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            marginBottom: '10px'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleRegisterAsHelper}
                            disabled={registering}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {registering ? 'Registering...' : 'Register as Helper'}
                        </button>
                        <button
                            onClick={() => setShowRegisterForm(false)}
                            style={{
                                padding: '12px 20px',
                                background: 'white',
                                color: '#999',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowRegisterForm(true)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, var(--primary-color), #ff6b9d)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        marginBottom: '20px'
                    }}
                >
                    🙋‍♀️ Become a Helper
                </button>
            )}

            {/* Helpers List */}
            <div className="helpers-list">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: 'var(--text-color)' }}>
                    Available Helpers ({helpers.length})
                </h4>
                {loading ? (
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>Loading helpers...</p>
                ) : helpers.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>
                        No helpers available at the moment. Be the first to help!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {helpers.map((helper) => (
                            <div
                                key={helper.id}
                                style={{
                                    background: '#fff5f8',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: '1px solid #ffc2d1'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>
                                            {helper.username}
                                        </p>
                                        {helper.bio && (
                                            <p style={{
                                                margin: '5px 0 0 0',
                                                fontSize: '0.85rem',
                                                color: '#666',
                                                fontStyle: 'italic'
                                            }}>
                                                "{helper.bio}"
                                            </p>
                                        )}
                                        {helper.latitude && helper.longitude && (
                                            <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#999' }}>
                                                📍 Location available
                                            </p>
                                        )}
                                    </div>
                                    <span style={{
                                        background: '#4caf50',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontWeight: '600'
                                    }}>
                                        Available
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunitySupport;
