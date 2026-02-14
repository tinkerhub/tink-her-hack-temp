import React, { useState } from 'react';
import axios from '../config/api';

const PadRequest = ({ user }) => {
    const [sending, setSending] = useState(false);

    const handlePadRequest = () => {
        console.log('Pad request button clicked!');
        console.log('User:', user);

        setSending(true);
        console.log('Starting pad request process...');

        // Check if geolocation is available
        if (!navigator.geolocation) {
            console.log('Geolocation not available');
            alert('Location access is required to send pad requests. Please enable location services.');
            setSending(false);
            return;
        }

        console.log('Requesting geolocation...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Got location:', location);

                try {
                    console.log('Sending pad request to backend...');
                    const response = await axios.post('/api/pad-request', {
                        userId: user.id,
                        username: user.username,
                        location
                    });
                    console.log('Pad request response:', response.data);
                    alert('✅ Pad request sent! Nearby users have been notified of your location.');
                    setSending(false);
                } catch (err) {
                    console.error('Error sending pad request:', err);
                    if (err.response?.data?.error) {
                        alert(`Failed: ${err.response.data.error}`);
                    } else {
                        alert('Failed to send request. Please try again.');
                    }
                    setSending(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please enable location services and try again.');
                setSending(false);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h3>🩸 Need Sanitary Pads?</h3>
            <button
                className="pad-request-btn"
                onClick={handlePadRequest}
                disabled={sending}
            >
                {sending ? 'SENDING REQUEST...' : 'REQUEST PADS'}
            </button>
            <p style={{ fontSize: '0.85rem', marginTop: '10px', color: '#666' }}>
                📍 Your current location will be shared with nearby users who can help.
            </p>
        </div>
    );
};

export default PadRequest;
