import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Mapping current path to view prop for Header (for active state)
    // precise mapping might need adjustment based on Header implementation
    const getViewFromPath = (path: string) => {
        if (path === '/landing' || path === '/') return 'home'; // Header 'home' maps to landing for now?
        if (path === '/dashboard') return 'home';
        // We might need to update Header to accept paths or just specialized strings
        // For now, let's keep it simple or refactor Header to use Links
        return 'home';
    };

    // We need to adapt Header to work with Router or temporarily wrap the navigation logic
    // But per instructions, we should fix the navigation order.
    // Let's assume we will Refactor Header to use Links later, or use this wrapper to handle navigation.

    // Quick fix: Remap Header's onViewChange to navigate
    const handleViewChange = (view: string) => {
        if (view === 'home') navigate('/landing');
        if (view === 'auth') navigate('/auth');

        const scrollToSection = (id: string) => {
            if (location.pathname !== '/landing') {
                navigate('/landing');
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        };

        if (view === 'how-it-works') scrollToSection('how-it-works');
        if (view === 'features') scrollToSection('features');
        if (view === 'saved') navigate('/saved');
        if (view === 'suggestions') scrollToSection('suggestions'); // Assuming suggestions also on landing or handled similarly
    };

    const isSplash = location.pathname === '/';

    if (isSplash) return <Outlet />;

    return (
        <div className="min-h-screen bg-off-white text-gray-900 font-sans selection:bg-gray-200 selection:text-gray-900 relative overflow-hidden flex flex-col">

            {/* 3D Floating Background Elements - Moved to Layout for consistency */}



            <Header currentView={getViewFromPath(location.pathname) as any} onViewChange={handleViewChange} />

            <main className="flex-grow pt-20 relative z-10 w-full" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <Outlet />
            </main>

            <footer className="text-center py-6 text-gray-400 text-sm relative z-10 bg-white/50 backdrop-blur-sm border-t border-gray-100">
                <p>&copy; {new Date().getFullYear()} Built by PocketPlan Intelligence. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
