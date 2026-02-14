from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# --- Input Context ---
class QuestContext(BaseModel):
    user_id: str
    location: Dict[str, float]  # {"lat": 0.0, "lon": 0.0}
    time_available: int  # minutes
    weather_condition: str  # e.g., "Clear", "Rain"
    vibe_preference: str  # e.g., "Chill", "Adventure"
    budget_tier: str  # "Free", "Budget", "Premium"

# --- Output Quest Models ---
class QuestStep(BaseModel):
    step_id: str
    place_name: str
    description: str
    action_item: str  # Gamification aspect (e.g., "Find the hidden mural")
    coordinates: Dict[str, float]
    estimated_duration: int

class QuestNetwork(BaseModel):
    quest_id: str
    title: str
    narrative: str
    safety_score: int  # 0-100
    social_vibe_score: int  # 0-100
    steps: List[QuestStep]
    gamification_challenges: List[str]
    total_duration: int
