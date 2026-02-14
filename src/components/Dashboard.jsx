import React from 'react';
import PeriodTracker from './PeriodTracker';
import PadRequest from './PadRequest';
import NearbyRequests from './NearbyRequests';
import CommunitySupport from './CommunitySupport';
import SisterhoodChats from './SisterhoodChats';

const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="dashboard-container">
            <div className="header">
                <h2>{user.username}'s Safe Space</h2>
                <button onClick={onLogout} className="logout-btn">Lock & Logout</button>
            </div>

            <PeriodTracker user={user} />
            <PadRequest user={user} />
            <NearbyRequests user={user} />
            <CommunitySupport user={user} />
            <SisterhoodChats user={user} />
        </div>
    );
};

export default Dashboard;
