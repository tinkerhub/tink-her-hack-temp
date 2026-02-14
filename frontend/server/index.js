import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8002;

// API KEYS
const GEOAPIFY_KEY = "dd38f283afcf48e8a8ee8c1e81102a86";
const OPENWEATHER_KEY = "0b095ed48ae02f8225c238988ebe108d";

app.use(cors());
app.use(express.json());

// --- Helper Functions ---

// 1. Get Coordinates
async function getCoordinates(locationName) {
    try {
        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(locationName)}&apiKey=${GEOAPIFY_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const { lat, lon } = data.features[0].properties;
            return { lat, lon };
        }
        return null;
    } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
    }
}

// 2. Get Weather
async function getWeather(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return {
            temp: data.main.temp,
            condition: data.weather[0].main,
            desc: data.weather[0].description
        };
    } catch (error) {
        console.error("Weather Error:", error);
        return { temp: 20, condition: "Clear", desc: "Unknown" };
    }
}

// 3. Get Places
async function getPlaces(lat, lon, categories) {
    try {
        const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=15&apiKey=${GEOAPIFY_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.features.map(f => ({
            name: f.properties.name || f.properties.street || "Unknown Place",
            address: f.properties.formatted,
            distance: f.properties.distance,
            categories: f.properties.categories
        }));
    } catch (error) {
        console.error("Places Error:", error);
        return [];
    }
}

// --- Smart Logic Configuration ---

function getCategoriesForVibeAndBudget(vibe, budget) {
    const v = vibe.toLowerCase();
    const b = budget ? budget.toLowerCase() : 'budget';

    let categories = [];

    // Vibe Mapping
    if (v.includes('active') || v.includes('sport')) categories.push('sport', 'leisure.park', 'entertainment.activity_park');
    else if (v.includes('chill') || v.includes('relax')) categories.push('catering.cafe', 'commercial.books', 'leisure.park');
    else if (v.includes('culture') || v.includes('art')) categories.push('entertainment.museum', 'entertainment.culture');
    else if (v.includes('night') || v.includes('fun')) categories.push('entertainment', 'catering.bar', 'catering.restaurant');
    else if (v.includes('romantic')) categories.push('catering.restaurant', 'leisure.park', 'tourism.sights');
    else categories.push('catering.cafe', 'leisure.park'); // Default

    // Budget Adjustment (Loose approximation via categories)
    if (b === 'free') {
        categories = categories.filter(c => c.includes('park') || c.includes('culture') || c.includes('books') || c.includes('sights'));
        if (categories.length === 0) categories.push('leisure.park', 'tourism.sights');
    } else if (b === 'premium') {
        categories.push('catering.restaurant');
    }

    return categories.join(',');
}

function generateMustTake(weather, vibe, placeCategory) {
    const items = ["Smartphone", "Wallet"]; // Essentials

    // Weather based
    if (weather.condition.includes("Rain") || weather.condition.includes("Drizzle")) items.push("Umbrella", "Rain Jacket");
    if (weather.condition.includes("Clear") || weather.condition.includes("Sun")) items.push("Sunglasses", "Sunscreen");
    if (weather.temp < 10) items.push("Warm Coat", "Gloves");
    if (weather.temp > 25) items.push("Water Bottle", "Deodorant");

    // Vibe/Place based
    const v = vibe.toLowerCase();
    if (v.includes("active") || placeCategory.includes("sport") || placeCategory.includes("park")) items.push("Walking Shoes", "Towel");
    if (v.includes("chill") || placeCategory.includes("cafe")) items.push("Book/Kindle", "Headphones");
    if (v.includes("work") || placeCategory.includes("coworking")) items.push("Laptop", "Charger");
    if (v.includes("romantic")) items.push("Mints", "Nice Outfit");
    if (placeCategory.includes("museum")) items.push("Student ID");

    return [...new Set(items)]; // Remove duplicates
}

// --- Main Endpoint ---

app.post('/suggest', async (req, res) => {
    const { location, time, preference, budget } = req.body;
    console.log(`\n--- Smart Vibe Finder Request ---`);
    console.log(`User: ${location} | ${time}m | ${preference} | ${budget}`);

    try {
        const coords = await getCoordinates(location);
        if (!coords) return res.status(404).json({ error: "Location not found" });

        const [weather, places] = await Promise.all([
            getWeather(coords.lat, coords.lon),
            getPlaces(coords.lat, coords.lon, getCategoriesForVibeAndBudget(preference || 'chill', budget))
        ]);

        if (places.length === 0) {
            return res.json({ name: "City Walk", distance: "0 min", duration: "30-60 Minutes", reason: ["Explore the area on foot!"], score: 80, weather: weather, must_take: ["Comfortable Shoes"] });
        }

        // Advanced Scoring Engine
        const scoredPlaces = places.map(place => {
            let score = 70; // Base score
            const explanation = [];

            // 1. Weather Impact
            if (['Rain', 'Snow', 'Thunderstorm'].some(c => weather.condition.includes(c))) {
                if (place.categories.some(c => c.includes('park') || c.includes('sport'))) {
                    score -= 30; explanation.push("Rainy weather makes this less ideal.");
                } else {
                    score += 20; explanation.push("Perfect cloudy/rainy day shelter.");
                }
            } else if (weather.condition === 'Clear' && place.categories.some(c => c.includes('park'))) {
                score += 25; explanation.push("Beautiful clear skies for outdoors.");
            }

            // 2. Budget Impact
            if (budget === 'free') {
                if (place.categories.some(c => c.includes('park') || c.includes('culture'))) {
                    score += 20; explanation.push("Wallet-friendly option.");
                }
            } else if (budget === 'premium' && place.categories.some(c => c.includes('restaurant'))) {
                score += 15; explanation.push("Matches your premium vibe.");
            }

            // 3. Time Impact
            const userTime = parseInt(time) || 60;
            if (userTime < 45 && place.distance > 3000) {
                score -= 15; explanation.push("Might be a bit far for your short timeframe.");
            }

            // Cap Score
            score = Math.min(Math.max(score, 40), 99);

            // "Must Take" Generation
            const mustTake = generateMustTake(weather, preference, place.categories.join(' '));

            return {
                ...place,
                score,
                reason: explanation.length > 0 ? explanation : [`Matches your ${preference} vibe perfectly.`],
                weather_summary: `${weather.condition}, ${Math.round(weather.temp)}°C`,
                must_take: mustTake
            };
        });

        scoredPlaces.sort((a, b) => b.score - a.score);
        const bestFit = scoredPlaces[0];

        res.json({
            name: bestFit.name,
            distance: `${Math.round(bestFit.distance / 80)} min walk`,
            duration: `${time} Minutes`,
            reason: bestFit.reason.slice(0, 3),
            score: bestFit.score,
            weather: bestFit.weather_summary,
            must_take: bestFit.must_take,
            alternative: scoredPlaces[1] ? scoredPlaces[1].name : "None"
        });

    } catch (error) {
        console.error("Handler Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Auto-Suggestions Endpoint
app.get('/suggestions', (req, res) => {
    // Simple logic based on server local time (simulated 'current' context)
    const hour = new Date().getHours();
    const suggestions = [];

    if (hour < 11) {
        suggestions.push("Morning Coffee Run", "Sunrise Park Walk", "Breakfast Spot");
    } else if (hour < 17) {
        suggestions.push("Visit local Museum", "City Park Stroll", "Coworking Session");
    } else {
        suggestions.push("Sunset Viewpoint", "Cozy Dinner", "Night Walk");
    }

    res.json(suggestions);
});

app.listen(PORT, () => {
    console.log(`Smart Vibe Finder Engine running at http://localhost:${PORT}`);
});
