import React, { useState, useEffect } from 'react';
import InputCard from '../components/InputCard';
import ResultCard from '../components/ResultCard';
import RecommendationList from '../components/RecommendationList';
import IntelligenceIndicators from '../components/IntelligenceIndicators';
import { Sparkles, MapPin, X } from 'lucide-react';

interface ResultData {
    name: string;
    distance: string;
    duration: string;
    reason: string[];
    score?: number;
    weather?: string;
    must_take?: string[];
    alternative?: string;
    music_recommendations?: string[];
    image_url?: string;
    categories?: string[];
}

const Dashboard: React.FC = () => {
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState<ResultData[]>([]);
    const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchContext, setSearchContext] = useState<any>(null);

    // Mock Data for "Guruvayur Temple"
    const guruvayurData: ResultData = {
        name: "Guruvayur Temple",
        distance: "25 km from Lulu",
        duration: "45 Mins",
        reason: ["Major Pilgrim Centre", "Historic Architecture", "Elephants Sanctuary"],
        score: 98,
        weather: "Clear",
        must_take: ["Traditional Wear", "Offerings"],
        music_recommendations: ["Devotional", "Carnatic"],
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Guruvayoor_Temple_East_Nada.jpg/1280px-Guruvayoor_Temple_East_Nada.jpg",
        categories: ["Temple"]
    };

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}suggestions`)
            .then(res => res.json())
            .then(data => setSuggestions(data))
            .catch(err => console.error("Failed to fetch suggestions", err));
    }, []);

    const handleSearch = async (data: { location: string; destination: string; time: string; preference: string; budget: string }) => {
        console.log("Search Data:", data);
        setIsThinking(true);
        setSearchContext(data);

        // --- TRAVEL SCENARIO LOGIC ---
        if (data.location.toLowerCase().includes('thrissur') && data.destination.toLowerCase().includes('lulu')) {
            console.log("Search Data:", data);

            setTimeout(() => {
                const mockScenarioResults: ResultData[] = [
                    {
                        name: "Lulu Mall Kochi",
                        distance: "72 km",
                        duration: "1 hr 45 min",
                        reason: ["Premium Shopping", "Food Court", "Cinema"],
                        score: 99,
                        weather: "Indoor AC",
                        must_take: ["Wallet", "Shopping Bags"],
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Lulu_Mall_Kochi_Atrium.jpg",
                        categories: ["Mall"]
                    },
                    {
                        name: "Edappally Church",
                        distance: "5 min walk",
                        duration: "30 Mins",
                        reason: ["Historic Site", "Peaceful", "Architecture"],
                        score: 85,
                        weather: "Sunny",
                        must_take: ["Camera"],
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/St._George_Syro-Malabar_Catholic_Forane_Church%2C_Edappally.jpg/1024px-St._George_Syro-Malabar_Catholic_Forane_Church%2C_Edappally.jpg",
                        categories: ["Stopover"]
                    },
                    {
                        name: "Paragon Restaurant",
                        distance: "Inside Mall",
                        duration: "1 Hour",
                        reason: ["Famous Biryani", "Kerala Cuisine"],
                        score: 92,
                        weather: "Indoor",
                        must_take: ["Appetite"],
                        image_url: "https://b.zmtcdn.com/data/pictures/chains/2/95002/9a416a249c55be027ea5fa023df37238.jpg",
                        categories: ["Food"]
                    },
                    {
                        name: "Marine Drive",
                        distance: "25 min drive",
                        duration: "1 Hour",
                        reason: ["Sunset View", "Boating", "Walkway"],
                        score: 88,
                        weather: "Breezy",
                        must_take: ["Sunglasses"],
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Marine_Walkway_Kochi.jpg/1280px-Marine_Walkway_Kochi.jpg",
                        categories: ["Stopover"]
                    }
                ];
                setResultData(mockScenarioResults);
                setShowResult(true);
                setIsThinking(false);
            }, 1000);
            return;
        }

        // --- GENERIC API CALL ---
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Backend not available');
            const result = await response.json();
            const resultsArray = Array.isArray(result) ? result : [result];

            setTimeout(() => {
                setResultData(resultsArray);
                setShowResult(true);
                setIsThinking(false);
            }, 800);

        } catch (error) {
            console.log("Using Fallback Data:", error);
            setTimeout(() => {
                const mockResult: ResultData = {
                    name: "Urban Coffee Break",
                    distance: "5 min walk",
                    duration: `${data.time} Minutes`,
                    reason: ["Fits time window", "Chill Vibe"],
                    score: 75,
                    weather: "Offline",
                    must_take: ["Wallet"],
                    categories: ["Food"]
                };
                setResultData([mockResult]);
                setShowResult(true);
                setIsThinking(false);
            }, 1500);
        }
    };

    const handleSelectResult = (item: ResultData) => {
        setSelectedResult(item);
    };

    const handleCloseModal = () => {
        // SCENARIO LOGIC: After visiting Lulu Mall, suggest Guruvayur Temple
        if (selectedResult?.name === "Lulu Mall Kochi" && searchContext?.location.toLowerCase().includes('thrissur')) {
            setResultData(prev => {
                if (prev.some(p => p.name === "Guruvayur Temple")) return prev;
                return [guruvayurData, ...prev];
            });
        }
        setSelectedResult(null);
    };

    return (
        <div className="container mx-auto px-4 pt-6 pb-16 relative">

            {/* Modal Overlay for Details */}
            {selectedResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="relative w-full max-w-2xl transform transition-all animate-slide-up bg-transparent">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute -top-12 right-0 md:-right-12 text-white hover:text-gray-200 transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        {/* Using existing ResultCard but handling the 'Back' prop as Close */}
                        <ResultCard
                            data={selectedResult}
                            onBack={handleCloseModal}
                            onFavorite={() => alert("Saved!")}
                        />
                    </div>
                </div>
            )}

            {!showResult ? (
                <div className="flex flex-col items-center">
                    {/* ... (Hero and Input sections - No Changes) ... */}
                    <div className="w-full flex justify-center items-center mb-16 mt-6">
                        <h1 className="text-[70px] md:text-[110px] lg:text-[150px] font-black tracking-tight text-black leading-none text-center">
                            PocketPlan
                        </h1>
                    </div>

                    <div className="w-full max-w-lg mb-12">
                        <InputCard onSearch={handleSearch} isThinking={isThinking} />
                    </div>

                    {suggestions.length > 0 && (
                        <div className="w-full max-w-2xl text-center animate-fade-in-up">
                            <p className="text-sm text-gray-500 mb-4 font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                                <Sparkles size={14} /> Quick Picks
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {suggestions.map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-700 border border-gray-100 hover:border-black transition-colors cursor-default">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-16 w-full max-w-4xl">
                        <IntelligenceIndicators />
                    </div>
                </div>
            ) : (
                <div className="w-full py-8 animate-fade-in flex flex-col items-center">
                    <div className="w-full max-w-7xl flex justify-between items-center mb-4 px-4">
                        <button onClick={() => { setShowResult(false); setResultData([]); }} className="flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-colors">
                            ← New Search
                        </button>
                        <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                            <MapPin size={14} />
                            {searchContext?.location}
                            {searchContext?.destination && ` → ${searchContext.destination}`}
                        </div>
                    </div>

                    <RecommendationList
                        recommendations={resultData}
                        onSelect={handleSelectResult}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
