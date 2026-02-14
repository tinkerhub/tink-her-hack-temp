import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

const Splash: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/landing');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 text-gray-900 z-50">
            <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <Hexagon size={64} className="text-primary animate-pulse-badge" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">PocketPlan</h1>
                <p className="text-gray-500 text-sm tracking-widest uppercase">Intelligence for your day</p>
            </div>
        </div>
    );
};

export default Splash;
