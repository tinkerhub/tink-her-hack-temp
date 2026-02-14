import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'training_data.csv')
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')
WEATHER_ENCODER_PATH = os.path.join(BASE_DIR, 'weather_encoder.pkl')
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, 'target_encoder.pkl')

def train_model():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found.")
        return

    df = pd.read_csv(DATA_PATH)

    # Encode Categorical Features
    print("Encoding features...")
    weather_encoder = LabelEncoder()
    df['weather_encoded'] = weather_encoder.fit_transform(df['weather'])

    # Encode Target
    target_encoder = LabelEncoder()
    df['target_encoded'] = target_encoder.fit_transform(df['preferred_type'])

    # Features and Target
    X = df[['weather_encoded', 'time_available', 'distance', 'rating']]
    y = df['target_encoded']

    # Split Data
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Model
    print("Training LogisticRegression model...")
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f"Model Accuracy: {accuracy:.4f}")

    # Save Artifacts
    print("Saving model and encoders...")
    joblib.dump(model, MODEL_PATH)
    joblib.dump(weather_encoder, WEATHER_ENCODER_PATH)
    joblib.dump(target_encoder, TARGET_ENCODER_PATH)
    print(f"Saved to {BASE_DIR}")

if __name__ == "__main__":
    train_model()
