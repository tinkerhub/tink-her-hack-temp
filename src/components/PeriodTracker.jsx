import React, { useState, useEffect } from 'react';
import axios from '../config/api';

const PeriodTracker = ({ user }) => {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPredicted, setNextPredicted] = useState(null);
    const [daysUntilNext, setDaysUntilNext] = useState(null);
    const [currentPhase, setCurrentPhase] = useState('');

    useEffect(() => {
        fetchCycles();
    }, []);

    useEffect(() => {
        if (cycles.length > 0) {
            calculatePredictions();
        }
    }, [cycles]);

    const fetchCycles = async () => {
        try {
            const res = await axios.get(`/api/cycles/${user.id}`);
            setCycles(res.data.cycles);
        } catch (err) {
            console.error('Error fetching cycles:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculatePredictions = () => {
        if (cycles.length === 0) return;

        // Get the most recent cycle
        const lastCycle = cycles[0];
        const lastStartDate = new Date(lastCycle.start_date);

        // Calculate average cycle length (default 28 days if not enough data)
        let avgCycleLength = 28;
        if (cycles.length >= 2) {
            let totalDays = 0;
            for (let i = 0; i < cycles.length - 1; i++) {
                const current = new Date(cycles[i].start_date);
                const next = new Date(cycles[i + 1].start_date);
                totalDays += Math.abs((current - next) / (1000 * 60 * 60 * 24));
            }
            avgCycleLength = Math.round(totalDays / (cycles.length - 1));
        }

        // Predict next period
        const predictedDate = new Date(lastStartDate);
        predictedDate.setDate(predictedDate.getDate() + avgCycleLength);
        setNextPredicted(predictedDate);

        // Calculate days until next period
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((predictedDate - today) / (1000 * 60 * 60 * 24));
        setDaysUntilNext(daysUntil);

        // Determine current phase
        const daysSinceLastPeriod = Math.floor((today - lastStartDate) / (1000 * 60 * 60 * 24));

        if (daysSinceLastPeriod <= 5) {
            setCurrentPhase('Menstrual Phase');
        } else if (daysSinceLastPeriod <= 13) {
            setCurrentPhase('Follicular Phase');
        } else if (daysSinceLastPeriod <= 17) {
            setCurrentPhase('Ovulation Phase');
        } else {
            setCurrentPhase('Luteal Phase');
        }
    };

    const logPeriod = async () => {
        const today = new Date().toISOString().split('T')[0];

        // Check if already logged today
        if (cycles.length > 0) {
            const lastCycle = cycles[0];
            if (lastCycle.start_date === today) {
                alert('You already logged your period for today!');
                return;
            }
        }

        try {
            await axios.post('/api/cycles', { userId: user.id, startDate: today });
            fetchCycles();
            alert('✅ Period logged successfully!');
        } catch (err) {
            console.error('Error logging period:', err);
            alert('Failed to log period. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysSince = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="card period-tracker-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>🌸 Period Tracker</h3>
            </div>

            {/* Prediction Section */}
            {cycles.length > 0 && nextPredicted && (
                <div className="prediction-box">
                    <div className="prediction-main">
                        <div className="prediction-icon">📅</div>
                        <div>
                            <p className="prediction-label">Next Period Expected</p>
                            <p className="prediction-date">{formatDate(nextPredicted)}</p>
                            {daysUntilNext !== null && (
                                <p className="prediction-days">
                                    {daysUntilNext > 0
                                        ? `in ${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''}`
                                        : daysUntilNext === 0
                                            ? 'Today!'
                                            : `${Math.abs(daysUntilNext)} day${Math.abs(daysUntilNext) !== 1 ? 's' : ''} overdue`
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                    {currentPhase && (
                        <div className="current-phase">
                            <span className="phase-label">Current Phase:</span>
                            <span className="phase-name">{currentPhase}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Log Period Button */}
            <button
                onClick={logPeriod}
                className="log-period-btn"
                disabled={loading}
            >
                📝 Log Period Start (Today)
            </button>

            {/* Cycle History */}
            <div className="cycle-history">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#590d22' }}>
                    Recent Cycles
                </h4>
                {loading ? (
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>Loading history...</p>
                ) : cycles.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>
                        No cycles logged yet. Click the button above to log your first period!
                    </p>
                ) : (
                    <div className="cycle-list">
                        {cycles.slice(0, 5).map((cycle, index) => {
                            const daysSince = getDaysSince(cycle.start_date);
                            return (
                                <div key={cycle.id} className="cycle-item">
                                    <div className="cycle-dot"></div>
                                    <div className="cycle-info">
                                        <p className="cycle-date">{formatDate(cycle.start_date)}</p>
                                        <p className="cycle-days-ago">
                                            {daysSince === 0
                                                ? 'Today'
                                                : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`
                                            }
                                        </p>
                                    </div>
                                    {index === 0 && (
                                        <span className="latest-badge">Latest</span>
                                    )}
                                </div>
                            );
                        })}
                        {cycles.length > 5 && (
                            <p style={{
                                textAlign: 'center',
                                color: '#999',
                                fontSize: '0.8rem',
                                marginTop: '10px'
                            }}>
                                + {cycles.length - 5} more cycle{cycles.length - 5 !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeriodTracker;
