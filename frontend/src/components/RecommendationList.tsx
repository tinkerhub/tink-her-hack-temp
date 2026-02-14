import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import FlashCard from './FlashCard';

interface RecommendationListProps {
    recommendations: any[];
    onSelect: (item: any) => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations, onSelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Sparkles size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Top Picks for You
                </h2>
            </div>

            <section className="mt-6 relative group/list">
                {/* Scroll Controls (Visible on hover/desktop) */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-lg p-3 rounded-full text-gray-700 hover:text-black hover:scale-110 transition-all opacity-0 group-hover/list:opacity-100 -ml-4 hidden md:block border border-gray-100"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-lg p-3 rounded-full text-gray-700 hover:text-black hover:scale-110 transition-all opacity-0 group-hover/list:opacity-100 -mr-4 hidden md:block border border-gray-100"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 hide-scrollbar"
                    style={{
                        scrollbarWidth: 'none',  /* Firefox */
                        msOverflowStyle: 'none'  /* IE and Edge */
                    }}
                >
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {/* Items */}
                    {recommendations.map((rec, index) => (
                        <div key={index} className="flex-none w-72 snap-center first:pl-4 last:pr-4">
                            <FlashCard data={rec} onClick={() => onSelect(rec)} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default RecommendationList;
