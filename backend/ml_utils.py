import joblib
import pandas as pd
import os
import logging

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global storage for model artifacts
_model = None
_weather_encoder = None
_target_encoder = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
WEATHER_ENCODER_PATH = os.path.join(BASE_DIR, 'weather_encoder.pkl')
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, 'target_encoder.pkl')

def load_model():
    """Lengths the trained model and encoders from disk."""
    global _model, _weather_encoder, _target_encoder
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(WEATHER_ENCODER_PATH) and os.path.exists(TARGET_ENCODER_PATH):
            _model = joblib.load(MODEL_PATH)
            _weather_encoder = joblib.load(WEATHER_ENCODER_PATH)
            _target_encoder = joblib.load(TARGET_ENCODER_PATH)
            logger.info("ML Model loaded successfully.")
            return True
        else:
            logger.warning("ML artifacts not found. Skipping model loading.")
            return False
    except Exception as e:
        logger.error(f"Failed to load ML model: {e}")
        return False

def predict_preferred_type(weather: str, time_available: int, rating: float, distance: float) -> str:
    """
    Predicts the preferred place type based on input features.
    Returns: 'cafe', 'park', 'museum', 'restaurant', or None if model not loaded.
    """
    if _model is None or _weather_encoder is None or _target_encoder is None:
        return None

    try:
        # Preprocess Weather
        # Handle unseen labels gracefully if possible, or force fallback
        try:
            weather_encoded = _weather_encoder.transform([weather])[0]
        except ValueError:
             # Fallback for unknown weather labels (e.g. 'Mist') -> map to 'cloudy' or similar if possible
             # For now, let's just default to a known one like 'cloudy' (encoded value) or catch exception
             # A safer approach is to check classes_ or try/except
             # Let's use 0 as a safe fallback if unknown
             weather_encoded = 0 
        
        # Create DataFrame for prediction (must match training interaction)
        features = pd.DataFrame([{
            'weather_encoded': weather_encoded,
            'time_available': time_available,
            'distance': distance,
            'rating': rating
        }])
        
        # Predict
        predicted_idx = _model.predict(features)[0]
        predicted_label = _target_encoder.inverse_transform([predicted_idx])[0]
        
        return predicted_label
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return None

def store_feedback(user_input: dict, chosen_place_type: str):
    """
    Placeholder for storing user feedback to retrain the model later.
    """
    # In a real app, this would save to a database or a feedback.csv file.
    logger.info(f"Feedback received: Input={user_input}, Chosen={chosen_place_type}")
    pass
