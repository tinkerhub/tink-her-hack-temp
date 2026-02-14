/**
 * She Wants - Emergency System (Frontend Simulation)
 * Uses BroadcastChannel to simulate real-time alerts between tabs.
 */

const Emergency = {
    channel: new BroadcastChannel('she_wants_emergency_channel'),

    // === SENDING ALERTS ===
    requestHelp: (user, location) => {
        const request = {
            id: 'req_' + Date.now(),
            user: {
                id: user.id,
                name: user.name,
                code: user.uniqueCode
            },
            location: location, // { lat, lng }
            timestamp: new Date().toISOString(),
            status: 'PENDING'
        };

        // Broadcast to other tabs (Helpers)
        Emergency.channel.postMessage({
            type: 'HELP_REQUEST',
            data: request
        });

        // Save to local history
        Emergency.saveRequest(request);
        return request;
    },

    respondToHelp: (requestId, helper) => {
        Emergency.channel.postMessage({
            type: 'HELP_RESPONSE',
            data: {
                requestId,
                helper: {
                    id: helper.id,
                    name: helper.name,
                    phone: helper.phone
                }
            }
        });
    },

    // === LISTENING ===
    listen: (onHelpRequest, onHelpResponse) => {
        Emergency.channel.onmessage = (event) => {
            const { type, data } = event.data;

            if (type === 'HELP_REQUEST' && onHelpRequest) {
                onHelpRequest(data);
            }

            if (type === 'HELP_RESPONSE' && onHelpResponse) {
                onHelpResponse(data);
            }
        };
    },

    // === STORAGE ===
    saveRequest: (request) => {
        const requests = JSON.parse(localStorage.getItem('safecycle_requests') || '[]');
        requests.push(request);
        localStorage.setItem('safecycle_requests', JSON.stringify(requests));
    },

    getHistory: () => {
        return JSON.parse(localStorage.getItem('safecycle_requests') || '[]');
    }
};

window.Emergency = Emergency;
