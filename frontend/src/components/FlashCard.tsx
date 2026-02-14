import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

interface FlashCardProps {
    data: {
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
    };
    onClick: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ data, onClick }) => {
    // 1. Determine Category
    let category = 'Stopover';
    const textToSearch = (data.name + ' ' + (data.categories?.join(' ') || '') + ' ' + (data.reason?.join(' ') || '')).toLowerCase();

    if (textToSearch.includes('mall') || textToSearch.includes('shopping')) category = 'Mall';
    else if (textToSearch.includes('temple') || textToSearch.includes('church') || textToSearch.includes('mosque') || textToSearch.includes('worship')) category = 'Temple';
    else if (textToSearch.includes('food') || textToSearch.includes('restaurant') || textToSearch.includes('cafe') || textToSearch.includes('eat') || textToSearch.includes('dining')) category = 'Food';

    // 2. Map Category to Colors
    const categoryStyles: Record<string, string> = {
        'Mall': 'bg-blue-50 text-blue-600',
        'Temple': 'bg-amber-50 text-amber-600',
        'Food': 'bg-rose-50 text-rose-600',
        'Stopover': 'bg-gray-100 text-gray-600'
    };

    const badgeClass = categoryStyles[category] || categoryStyles['Stopover'];

    return (
        <div
            onClick={onClick}
            className="group relative bg-white rounded-xl shadow-md cursor-pointer overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
        >
            {/* Image Header - Fixed Height h-40 */}
            <div className="h-40 w-full relative bg-gray-100 shrink-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                        backgroundImage: data.image_url ? `url(${data.image_url})` : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>

                {/* Score Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-gray-900 font-bold text-xs border border-white/50 shadow-sm">
                    {data.score || 85}% Match
                </div>
            </div>

            {/* Content Container - Middle & Bottom */}
            <div className="p-4 flex flex-col grow">
                {/* Header: Name & Badge */}
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold text-base text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>
                        {data.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-[0.65rem] rounded-full font-semibold uppercase tracking-wide whitespace-nowrap ${badgeClass}`}>
                        {category}
                    </span>
                </div>

                {/* Description - 2 Lines Max */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                    {data.reason && data.reason.join(' • ')}
                </p>

                {/* Footer Metadata */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{data.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{data.duration}</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-blue-600 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-5px] group-hover:translate-x-0">
                        View <ArrowRight size={12} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashCard;
