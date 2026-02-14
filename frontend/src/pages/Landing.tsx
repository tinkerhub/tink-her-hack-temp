import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { X, Check, ArrowRight } from 'lucide-react';

// Detail Modal Component
const DetailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    content: any;
}> = ({ isOpen, onClose, content }) => {
    if (!isOpen || !content) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-slide-up border-4 border-black">
                {/* Header */}
                <div className="bg-black text-white p-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        {content.tag}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{content.title}</h2>
                    <p className="text-gray-300 text-lg font-medium">{content.subtitle}</p>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Main Description */}
                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                        {content.description}
                    </p>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {content.features.map((feature: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-black text-white p-2 rounded-lg">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="text-black font-bold flex items-center gap-2 hover:gap-3 transition-all group"
                        >
                            Close Details <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Card Details Data
const cardDetails = {
    'how-it-works': {
        tag: 'Intelligent Process',
        title: 'From Chaos to Curated',
        subtitle: 'The 4-step system that saves your evening.',
        description: 'PocketPlan replaces hours of Googling and group chat indecision with a single, high-confidence recommendation engine.',
        features: [
            { title: 'Location & Vibe', desc: 'We pinpoint your coordinates and let you define the exact mood—Chill, Energetic, Romantic, or Focus.' },
            { title: 'Real-Time Analysis', desc: 'Our engine queries live weather APIs and checks diverse closing times instantly.' },
            { title: 'Smart Scoring', desc: 'We cross-reference thousands of spots, scoring them based on your vibe + current conditions.' },
            { title: 'The Perfect Plan', desc: 'You get a single, curated choice, not a confusing list of 50 mediocre options.' }
        ]
    },
    'features': {
        tag: 'Real-World Tools',
        title: 'Built for Unpredictability',
        subtitle: 'Features that adapt when plans change.',
        description: 'The real world is messy. Rain starts, places close, and vibes shift. PocketPlan anticipates these changes before they ruin your night.',
        features: [
            { title: 'Live Weather Adaptation', desc: 'If rain is detected, outdoor spots are instantly downranked in favor of cozy indoor venues.' },
            { title: 'Vibe Filtering', desc: 'Proprietary algorithms match venue acoustics and lighting levels to your selected mood.' },
            { title: 'Time Logic', desc: 'We never suggest a coffee shop that closes in 15 minutes. Our time-aware engine ensures longer visits.' },
            { title: 'Crowd Avoidance', desc: 'Intelligent routing suggests off-peak locations for diverse experiences.' }
        ]
    },
    'suggestions': {
        tag: 'Contextual Advice',
        title: 'More Than Just "Where"',
        subtitle: 'Smart preparation for every scenario.',
        description: 'A great plan isn\'t just about the destination—it\'s about being prepared. We act as your intelligent assistant for the journey.',
        features: [
            { title: 'Smart Inventory', desc: '"It\'s 18°C and windy? Take a light jacket." "Going to a startup hub? Bring your laptop charger."' },
            { title: 'Backup Plans', desc: 'We always generate a "Plan B" automatically, just in case your primary spot is unexpectedly full.' },
            { title: 'Transit Tips', desc: 'Real-time estimates on travel time based on your current mode of transport.' },
            { title: 'Cost Estimation', desc: 'Upfront budget brackets so you know exactly what to expect before you arrive.' }
        ]
    },
    'everything': {
        tag: 'Personalized System',
        title: 'Your Social Second Brain',
        subtitle: 'A platform that learns and evolves.',
        description: 'PocketPlan isn\'t a one-off search tool. It\'s a persistent system that understands your preferences and history.',
        features: [
            { title: 'History Logs', desc: 'Never forget that amazing cafe you found three weeks ago. We keep a curated log of your best trips.' },
            { title: 'Privacy First', desc: 'Your location data is used *only* for the realtime search and is never sold to third-party advertisers.' },
            { title: 'Continuous Evolution', desc: 'The more you use PocketPlan, the smarter it gets at predicting your niche preferences.' },
            { title: 'Community Gems', desc: 'Access highly-rated hidden gems verified by the local PocketPlan community.' }
        ]
    }
};

const Landing: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    const handleGetStarted = () => {
        navigate('/auth');
    };

    const openCard = (id: string) => {
        setSelectedCard(id);
    };

    const closeCard = () => {
        setSelectedCard(null);
    };

    const getDetailContent = () => {
        return selectedCard ? cardDetails[selectedCard as keyof typeof cardDetails] : null;
    };

    return (
        <div className="animate-fade-in pb-12 bg-white" style={{ fontFamily: 'Inter, sans-serif', color: '#111827' }}>
            <Hero onGetStarted={handleGetStarted} />

            {/* Detail Modal */}
            <DetailModal
                isOpen={!!selectedCard}
                onClose={closeCard}
                content={getDetailContent()}
            />

            <div className="py-12 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-[1400px]">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-black mb-6 flex items-center justify-center flex-wrap">
                            POCKETPLAN FUNCTIONS
                            <span className="bg-black text-white text-lg px-3 py-1 font-mono transform -rotate-2">#activate</span>
                        </h2>
                        <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
                            Intelligent tools to streamline your plans, enhance your lifestyle, and discover new possibilities. Activating your personal planner.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 pt-8">

                        {/* Card 1: HOW IT WORKS */}
                        <div
                            id="how-it-works"
                            onClick={() => openCard('how-it-works')}
                            className="bg-white border-4 border-black p-6 relative transform -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:transform hover:rotate-0 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] cursor-pointer transition-all duration-300 scroll-mt-32 flex flex-col h-full group"
                        >

                            <div className="bg-black text-white font-bold py-1 px-3 mb-6 text-sm uppercase tracking-wider inline-block transform -rotate-1 self-start">
                                How It Works (Intelligent Process)
                            </div>


                        </div>

                        {/* Card 2: FEATURES */}
                        <div
                            id="features"
                            onClick={() => openCard('features')}
                            className="bg-white border-4 border-black p-6 relative transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:transform hover:rotate-0 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] cursor-pointer transition-all duration-300 scroll-mt-32 flex flex-col h-full group"
                        >

                            <div className="bg-black text-white font-bold py-1 px-3 mb-6 text-sm uppercase tracking-wider inline-block transform rotate-1 self-start">
                                Features (Real-World Tools)
                            </div>


                        </div>

                        {/* Card 3: SUGGESTIONS */}
                        <div
                            id="suggestions"
                            onClick={() => openCard('suggestions')}
                            className="bg-white border-4 border-black p-6 relative transform -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:transform hover:rotate-0 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] cursor-pointer transition-all duration-300 scroll-mt-32 flex flex-col h-full group"
                        >

                            <div className="bg-black text-white font-bold py-1 px-3 mb-6 text-sm uppercase tracking-wider inline-block transform -rotate-1 self-start">
                                Suggestions (Contextual Advice)
                            </div>


                        </div>

                        {/* Card 4: EVERYTHING */}
                        <div
                            onClick={() => openCard('everything')}
                            className="bg-white border-4 border-black p-6 relative transform rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:transform hover:rotate-0 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] cursor-pointer transition-all duration-300 flex flex-col h-full group"
                        >

                            <div className="bg-black text-white font-bold py-1 px-3 mb-6 text-sm uppercase tracking-wider inline-block transform rotate-1 self-start">
                                Everything (Personalized System)
                            </div>


                        </div>

                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="container mx-auto px-4 py-32 text-center">
                <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-[#111111]">Ready to plan smarter?</h2>
                <p className="text-xl text-gray-500 mb-12 font-medium max-w-2xl mx-auto">Join thousands who have stopped searching and started experiencing.</p>
                <button
                    onClick={handleGetStarted}
                    className="bg-[#111111] text-white px-12 py-6 rounded-full font-bold text-xl hover:transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                    Start Planning Now
                </button>
            </div>
        </div>
    );
};

export default Landing;
