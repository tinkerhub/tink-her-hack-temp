import React, { useState, useEffect } from 'react';
import axios from '../config/api';

const NearbyRequests = ({ user }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNearbyRequests();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchNearbyRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNearbyRequests = async () => {
        try {
            setRefreshing(true);
            const res = await axios.get(`/api/pad-requests/nearby/${user.id}`);
            setRequests(res.data.requests);
        } catch (err) {
            console.error('Error fetching nearby requests:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        // Haversine formula to calculate distance in km
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const handleHelp = async (request) => {
        console.log('Help button clicked for request:', request);

        if (!navigator.geolocation) {
            alert('❌ Location access is needed to help. Please enable location services.');
            return;
        }

        console.log('Getting current position...');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const myLat = position.coords.latitude;
                const myLng = position.coords.longitude;
                console.log('My location:', myLat, myLng);
                console.log('Request location:', request.latitude, request.longitude);

                const distance = calculateDistance(myLat, myLng, request.latitude, request.longitude);
                console.log('Distance calculated:', distance, 'km');

                // Show info without blocking
                const helpMessage = `Help ${request.username}?\n\nThey are approximately ${distance} km away.\n\nThis will:\n1. Mark the request as fulfilled\n2. Open Google Maps with directions`;

                if (window.confirm(helpMessage)) {
                    console.log('User confirmed help');

                    try {
                        // Mark as fulfilled
                        console.log('Marking request as fulfilled...');
                        await axios.post('/api/pad-request/fulfill', {
                            requestId: request.id,
                            fulfilledBy: user.id
                        });
                        console.log('Request marked as fulfilled');

                        // Create Google Maps URL with both origin and destination
                        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${myLat},${myLng}&destination=${request.latitude},${request.longitude}&travelmode=driving`;
                        console.log('Opening Google Maps URL:', mapsUrl);

                        // Open in new tab
                        const newWindow = window.open(mapsUrl, '_blank');

                        if (newWindow) {
                            console.log('Google Maps opened successfully');
                            alert('✅ Request marked as fulfilled!\n🗺️ Opening Google Maps with directions...');
                        } else {
                            console.warn('Popup blocked');
                            alert('✅ Request marked as fulfilled!\n\n⚠️ Please allow popups to open Google Maps.\n\nManual link:\n' + mapsUrl);
                            // Try to navigate in same tab as fallback
                            window.location.href = mapsUrl;
                        }

                        // Refresh the list
                        fetchNearbyRequests();
                    } catch (err) {
                        console.error('Error fulfilling request:', err);
                        alert('❌ Failed to update request. Please try again.\n\nError: ' + (err.response?.data?.error || err.message));
                    }
                } else {
                    console.log('User cancelled help');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location. ';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please enable location permissions for this site.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }

                alert('❌ ' + errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>🆘 Nearby Requests</h3>
                <button
                    onClick={fetchNearbyRequests}
                    disabled={refreshing}
                    style={{
                        padding: '5px 10px',
                        fontSize: '0.85rem',
                        background: 'transparent',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {refreshing ? '🔄' : '↻ Refresh'}
                </button>
            </div>

            {loading ? (
                <p>Loading nearby requests...</p>
            ) : requests.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    No active requests nearby. Check back later!
                </p>
            ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="request-item"
                            style={{
                                background: '#fff5f5',
                                padding: '12px',
                                marginBottom: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ffcdd2'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: '0 0 5px 0', fontWeight: '600', fontSize: '0.95rem' }}>
                                        {request.username}
                                    </p>
                                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#666' }}>
                                        📍 {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
                                    </p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: '#999' }}>
                                        {formatTime(request.created_at)}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                    <button
                                        onClick={() => handleHelp(request)}
                                        style={{
                                            background: 'linear-gradient(135deg, #ff8fa3, #ff6b9d)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Help 💝
                                    </button>
                                    <button
                                        onClick={() => {
                                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`;
                                            console.log('Opening map view:', mapsUrl);
                                            window.open(mapsUrl, '_blank');
                                        }}
                                        style={{
                                            background: 'white',
                                            color: '#ff6b9d',
                                            border: '1px solid #ff6b9d',
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        🗺️ View on Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NearbyRequests;
