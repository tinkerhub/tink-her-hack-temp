import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

import backend.ml_utils as ml_utils
import backend.music_utils as music_utils

app = FastAPI(title="PocketPlan")

@app.on_event("startup")
async def startup_event():
    ml_utils.load_model()

# --- Configuration ---
PORT = 8001
GEOAPIFY_KEY = "dd38f283afcf48e8a8ee8c1e81102a86"
OPENWEATHER_KEY = "0b095ed48ae02f8225c238988ebe108d"

# CORS Configuration - Allow all origins for public API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when using wildcard
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers to the client
)

# --- Data Models ---
class SearchRequest(BaseModel):
    location: str
    time: str
    preference: str  # Vibe
    budget: Optional[str] = "budget"

class PlaceResponse(BaseModel):
    name: str
    distance: str
    duration: str
    reason: List[str]
    score: int
    weather: str
    must_take: List[str]
    alternative: Optional[str] = None
    music_recommendations: List[str] = []
    image_url: Optional[str] = None

def get_placeholder_image(categories: List[str]) -> str:
    """Returns a high-quality Unsplash image based on place category."""
    cats = " ".join(categories).lower()
    
    if "cafe" in cats or "coffee" in cats:
        return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    elif "park" in cats or "nature" in cats:
        return "https://images.unsplash.com/photo-1496425745709-5f92975952f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    elif "museum" in cats or "art" in cats or "culture" in cats:
        return "https://images.unsplash.com/photo-1503152398395-d8a22e821c74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    elif "bar" in cats or "pub" in cats or "night" in cats:
        return "https://images.unsplash.com/photo-1514362545857-3bc1654f783b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    elif "restaurant" in cats or "food" in cats:
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    elif "gym" in cats or "sport" in cats:
        return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    
    # Default City Vibe
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

class Favorite(BaseModel):
    name: str
    location: str
    score: int

# --- Persistence (JSON File) ---
DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"favorites": [], "history": []}
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except:
        return {"favorites": [], "history": []}

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# --- Helper Functions ---

async def get_coordinates(location_name: str):
    async with httpx.AsyncClient() as client:
        url = f"https://api.geoapify.com/v1/geocode/search?text={location_name}&apiKey={GEOAPIFY_KEY}"
        try:
            response = await client.get(url)
            data = response.json()
            if data.get("features"):
                props = data["features"][0]["properties"]
                return props["lat"], props["lon"]
        except Exception as e:
            print(f"Geocoding Error: {e}")
    return None, None

async def get_weather(lat: float, lon: float):
    async with httpx.AsyncClient() as client:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_KEY}"
        try:
            response = await client.get(url)
            data = response.json()
            return {
                "temp": data["main"]["temp"],
                "condition": data["weather"][0]["main"],
                "desc": data["weather"][0]["description"]
            }
        except Exception as e:
            print(f"Weather Error: {e}")
    return {"temp": 20, "condition": "Clear", "desc": "Unknown"}

def get_categories_for_vibe(vibe: str, budget: str) -> str:
    v = vibe.lower()
    b = budget.lower() if budget else "budget"
    categories = []

    if "active" in v or "sport" in v:
        categories.extend(["sport", "leisure.park", "entertainment.activity_park"])
    elif "chill" in v or "relax" in v:
        categories.extend(["catering.cafe", "commercial.books", "leisure.park"])
    elif "culture" in v or "art" in v:
        categories.extend(["entertainment.museum", "entertainment.culture"])
    elif "night" in v or "fun" in v:
        categories.extend(["entertainment", "catering.bar", "catering.restaurant"])
    elif "romantic" in v:
        categories.extend(["catering.restaurant", "leisure.park", "tourism.sights"])
    else:
        categories.extend(["catering.cafe", "leisure.park"])

    # Budget Filter
    if b == "free":
        # Keep only free-ish categories
        categories = [c for c in categories if "park" in c or "culture" in c or "sights" in c]
        if not categories:
            categories = ["leisure.park", "tourism.sights"]
    elif b == "premium":
        if "catering.restaurant" not in categories:
            categories.append("catering.restaurant")

    return ",".join(categories)

async def get_places(lat: float, lon: float, categories: str):
    async with httpx.AsyncClient() as client:
        url = f"https://api.geoapify.com/v2/places?categories={categories}&filter=circle:{lon},{lat},5000&bias=proximity:{lon},{lat}&limit=15&apiKey={GEOAPIFY_KEY}"
        try:
            response = await client.get(url)
            data = response.json()
            return [{
                "name": f.get("properties", {}).get("name") or "Unknown Place",
                "distance": f.get("properties", {}).get("distance", 0),
                "categories": f.get("properties", {}).get("categories", [])
            } for f in data.get("features", [])]
        except Exception as e:
            print(f"Places Error: {e}")
            return []

def generate_must_take(weather: dict, vibe: str, place_categories: List[str]) -> List[str]:
    items = set(["Smartphone", "Wallet"])
    cond = weather["condition"]
    temp = weather["temp"]

    if "Rain" in cond or "Drizzle" in cond:
        items.update(["Umbrella", "Rain Jacket"])
    if "Clear" in cond or "Sun" in cond:
        items.update(["Sunglasses", "Sunscreen"])
    if temp < 10:
        items.update(["Warm Coat", "Gloves"])
    if temp > 25:
        items.update(["Water Bottle", "Deodorant"])

    v = vibe.lower()
    cats = " ".join(place_categories)
    
    if "active" in v or "sport" in cats or "park" in cats:
        items.update(["Walking Shoes", "Towel"])
    if "chill" in v or "cafe" in cats:
        items.update(["Book/Kindle", "Headphones"])
    if "work" in v or "coworking" in cats:
        items.update(["Laptop", "Charger"])
    if "romantic" in v:
        items.update(["Mints"])
    if "museum" in cats:
        items.update(["Student ID"])

    return list(items)

# --- Routes ---

@app.post("/recommend", response_model=List[PlaceResponse])
async def recommend(req: SearchRequest):
    lat, lon = await get_coordinates(req.location)
    if not lat:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Save to history
    data = load_data()
    data["history"].append({
        "location": req.location,
        "vibe": req.preference,
        "date": datetime.now().isoformat()
    })
    save_data(data)

    weather = await get_weather(lat, lon)
    cats = get_categories_for_vibe(req.preference, req.budget)
    places = await get_places(lat, lon, cats)

    if not places:
        return [PlaceResponse(
            name="City Walk",
            distance="0 min walk",
            duration=f"{req.time} Minutes",
            reason=["Explore the area on foot!"],
            score=80,
            weather=f"{weather['condition']}, {int(weather['temp'])}°C",
            must_take=["Comfortable Shoes"]
        )]

    # Scoring Logic
    scored_places = []
    
    # ML Prediction Context
    model_weather = weather["condition"].lower()
    if "rain" in model_weather: model_weather = "rainy"
    elif "clear" in model_weather or "sun" in model_weather: model_weather = "sunny"
    else: model_weather = "cloudy"

    time_avail = int(req.time) if req.time.isdigit() else 60

    for p in places:
        score = 70
        explanation = []
        p_cats = p["categories"]

        # --- ML Prediction Scoring ---
        try:
            dist_metric = p["distance"] / 100 
            rating_metric = 4.5 

            predicted_type = ml_utils.predict_preferred_type(
                model_weather, 
                time_avail, 
                rating_metric,
                dist_metric
            )

            if predicted_type:
                is_match = False
                if predicted_type == 'cafe' and 'catering.cafe' in p_cats: is_match = True
                if predicted_type == 'park' and 'leisure.park' in p_cats: is_match = True
                if predicted_type == 'museum' and 'entertainment.museum' in p_cats: is_match = True
                if predicted_type == 'restaurant' and 'catering.restaurant' in p_cats: is_match = True

                if is_match:
                    score += 5
                    explanation.append(f"AI suggests {predicted_type}s right now.")
                    ml_utils.store_feedback(req.dict(), predicted_type)
        except Exception as e:
            print(f"ML Scoring Error: {e}")

        # Weather Impact
        if any(x in weather["condition"] for x in ['Rain', 'Snow']):
            if any("park" in c for c in p_cats):
                score -= 30
                explanation.append("Rain makes outdoors less ideal.")
            else:
                score += 20
                explanation.append("Great indoor shelter.")
        elif weather["condition"] == "Clear" and any("park" in c for c in p_cats):
            score += 25
            explanation.append("Perfect weather for outdoors.")

        # Budget Impact
        if req.budget == "free":
            if any("park" in c or "culture" in c for c in p_cats):
                score += 20
                explanation.append("Wallet-friendly.")
        elif req.budget == "premium":
             if any("restaurant" in c for c in p_cats):
                 score += 15
                 explanation.append("Premium vibe.")

        # Time/Distance Impact
        if time_avail < 45 and p["distance"] > 3000:
            score -= 15
            explanation.append("A bit far for your time.")

        score = max(40, min(99, score))
        
        must_take = generate_must_take(weather, req.preference, p_cats)
        if not explanation:
            explanation.append(f"Matches your {req.preference} vibe.")

        scored_places.append({
            **p,
            "score": score,
            "reason": explanation,
            "must_take": must_take,
            "weather_summary": f"{weather['condition']}, {int(weather['temp'])}°C"
        })

    scored_places.sort(key=lambda x: x["score"], reverse=True)
    
    # Return top 6 recommendations
    top_picks = scored_places[:6]
    results = []

    for pick in top_picks:
        music_recs = music_utils.get_music_recommendations(
            weather["condition"],
            req.preference,
            pick["categories"]
        )
        place_image = get_placeholder_image(pick["categories"])
        
        results.append(PlaceResponse(
            name=pick["name"],
            distance=f"{int(pick['distance'] / 80)} min walk",
            duration=f"{req.time} Minutes",
            reason=pick["reason"][:2],
            score=pick["score"],
            weather=pick["weather_summary"],
            must_take=pick["must_take"],
            alternative=None, # No longer needed for individual cards but keeping model compatible
            music_recommendations=music_recs,
            image_url=place_image
        ))

    return results

@app.get("/suggestions")
def get_suggestions():
    hour = datetime.now().hour
    if hour < 11:
        return ["Morning Coffee Run", "Sunrise Park Walk", "Breakfast Spot"]
    elif hour < 17:
         return ["Visit local Museum", "City Park Stroll", "Coworking Session"]
    else:
        return ["Sunset Viewpoint", "Cozy Dinner", "Night Walk"]

@app.get("/favorites")
def get_favorites():
    return load_data().get("favorites", [])

@app.post("/favorites")
def add_favorite(fav: Favorite):
    data = load_data()
    # Check if exists
    if not any(f["name"] == fav.name for f in data["favorites"]):
        data["favorites"].append(fav.dict())
        save_data(data)
    return {"message": "Saved"}

@app.get("/history")
def get_history():
    return load_data().get("history", [])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
