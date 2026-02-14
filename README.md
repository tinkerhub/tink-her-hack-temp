
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# Pocket Plans 🎯

## Basic Details

### Team Name: Immersivea

### Team Members
- Member 1: Annrose PT - Christ College of Engineering
- Member 2: Ananya Biju - Christ College of Engineering

### Hosted Project Link
[mention your project hosted link here]

### Project Description
Pocket Plans is an AI-powered travel roadmap generator that creates structured mini-itineraries based on your mood, time availability, and location. Instead of suggesting just one place, it designs a complete journey plan — including stop sequence, time allocation, food breaks, and optimized routes. It transforms short free time into a curated, smart travel experience.

### The Problem statement
People often have limited free time but struggle to decide how to spend it meaningfully. Most apps recommend a single place, forcing users to plan everything else themselves — routes, timing, food stops, and sequencing. This leads to decision fatigue, poor time utilization, and missed opportunities to explore nearby experiences efficiently.

### The Solution
Pocket Plans solves this by using intelligent recommendation logic and real-time APIs to generate a structured travel roadmap instead of a single suggestion. Based on user inputs like mood, available time, and location, the system analyzes nearby places, weather conditions, and ratings to create an optimized sequence of destinations. It allocates time per stop, suggests food breaks, and provides a clear route map — transforming scattered options into a seamless, ready-to-follow mini itinerary.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: Python, JavaScript
- Frameworks used: FastAPI
- Libraries used: `requests`, `geopy`, `pydantic`, `python-dotenv`, `uvicorn`
- Tools used: VS Code, Git, Geoapify Places API, OpenWeatherMap API

---

## Features

- **Context-Aware Recommendations**: Tailors suggestions based on current weather (Boosting indoor spots when raining, parks when clear).
- **Time-Optimized Scoring**: Prioritizes activities that fit perfectly within your available time window.
- **Micro-Itinerary Generation**: Calculates distances and estimates time needed for each activity.
- **Google Maps Integration**: Provides direct navigation links for every recommended spot.
- **Smart Category Filtering**: Automatically searches for the best Cafes, Restaurants, and Parks in your immediate vicinity.

---

## Implementation

### For Software:

#### Installation
```bash
pip install -r requirements.txt
```

#### Run
```bash
uvicorn main:app --reload
```

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

<img width="1864" height="962" alt="image" src="https://github.com/user-attachments/assets/2e6b2e91-202e-4bb7-a394-f7b444434b71" />

<img width="1874" height="848" alt="image" src="https://github.com/user-attachments/assets/a756e210-4c40-4590-85ce-6d87c384ef4d" />

<img width="1868" height="945" alt="image" src="https://github.com/user-attachments/assets/5aeae5ce-8b8a-4611-89fd-b4847ced8a7f" />


#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*FastAPI server orchestrating requests between Geoapify for geolocation/places and OpenWeatherMap for environmental context.*

**Application Workflow:**

![Workflow](docs/workflow.png)
*User inputs Location & Time -> Backend Fetches Weather -> Backend Fetches Nearby Places -> Scoring Algorithm sorts results -> Top Recommendation returned.*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `http://127.0.0.1:8000`

##### Endpoints

**POST /suggest**
- **Description:** Returns the best activity recommendation based on location and time.
- **Request Body:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "time_available": 45
}
```
- **Response:**
```json
{
  "name": "Cafe Mocha",
  "distance": "0.15 km",
  "time_needed": "30 mins",
  "rating": 4.0,
  "maps_url": "https://www.google.com/maps/search/?api=1&query=Cafe%20Mocha"
}
```

---

## AI Tools Used (Optional - For Transparency Bonus)

**Tool Used:** Antigravity (Google DeepMind)

**Purpose:**
- Architecting the FastAPI backend structure.
- Implementing the weighted scoring algorithm for activity recommendations.
- Refactoring the API integration from Foursquare to Geoapify.
- Generating unit tests and API verification scripts.

**Key Prompts Used:**
- "Build a FastAPI backend for Pocket Plans that recommends micro-activities."
- "Refactor to use Geoapify Places API for better nearby search."
- "Improve the scoring logic to account for rainy weather and time availability."

**Percentage of AI-generated code:** Approximately 85%

**Human Contributions:**
- Creative concept and problem statement definition.
- API provider research and key generation.
- Frontend vision and user requirement specification.
- Team coordination and project submission.

---

## Team Contributions

- **Annrose PT**: Frontend development, UI/UX design decisions, and project documentation.
- **Ananya Biju**: Backend architecture, API integration (Geoapify/Weather), and algorithmic scoring logic.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ at TinkerHub
