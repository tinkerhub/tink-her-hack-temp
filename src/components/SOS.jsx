import React, { useState } from 'react';
import axios from '../config/api';

const SOS = ({ user }) => {
    const [sending, setSending] = useState(false);

    const handleSOS = () => {
        console.log('SOS button clicked!');
        console.log('User:', user);

        // Note: Removed confirm dialog as it was blocking SOS in some browsers
        // For emergency situations, immediate action is more important

        setSending(true);
        console.log('Starting SOS process...');

        // Check if geolocation is available
        if (!navigator.geolocation) {
            console.log('Geolocation not available');
            sendSOSWithoutLocation();
            return;
        }

        console.log('Requesting geolocation...');
        // Try to get location with timeout
        const timeoutId = setTimeout(() => {
            console.log('Geolocation timeout, sending without location');
            sendSOSWithoutLocation();
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                clearTimeout(timeoutId);
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Got location:', location);

                try {
                    console.log('Sending SOS with location to backend...');
                    const response = await axios.post('/api/sos', { userId: user.id, location });
                    console.log('SOS response:', response.data);
                    alert('SOS ALERT SENT! Help is on the way. Location shared.');
                    setSending(false);
                } catch (err) {
                    console.error('Error sending SOS:', err);
                    alert('Failed to send alert. Please try again.');
                    setSending(false);
                }
            },
            (error) => {
                clearTimeout(timeoutId);
                console.error('Geolocation error:', error);
                sendSOSWithoutLocation();
            },
            { timeout: 5000, enableHighAccuracy: false }
        );
    };

    const sendSOSWithoutLocation = async () => {
        console.log('Sending SOS without location...');
        try {
            const response = await axios.post('/api/sos', {
                userId: user.id,
                location: { lat: 0, lng: 0, note: 'Location unavailable' }
            });
            console.log('SOS response (no location):', response.data);
            alert('SOS ALERT SENT! Help is on the way. (Location not available)');
        } catch (err) {
            console.error('Error sending SOS without location:', err);
            alert('Failed to send alert. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h3>Emergency Help</h3>
            <button className="sos-btn" onClick={handleSOS} disabled={sending}>
                {sending ? 'SENDING HELP...' : 'SOS'}
            </button>
            <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                Pressing this will notify nearby verified users of your location.
            </p>
        </div>
    );
};

export default SOS;
