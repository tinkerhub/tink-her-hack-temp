# MOTHER HEAVEN🎯

## Basic Details

**Team Name:** GIRLY POP

**Team Members**
- Member 1: TEENA SAJI - CHRIST COLLEGE OF ENGINEERING
- Member 2: TINA KURIAN V - CHRIST COLLEGE OF ENGINEERING

**Hosted Project Link**
motherheaven.netlify.app

---

## Project Description

MOTHER HEAVEN is a React-based healthcare web application that helps new mothers track their recovery journey after childbirth. The app monitors daily wellness signals (mood, sleep, bleeding, pain, iron intake, support levels) and automatically calculates a recovery score (0-100) with risk classification. It provides context-aware guidance by connecting high-risk users with specialists, moderate-risk users with nutritionists, and stable users with recovery tips. The system includes trend visualization to help users and healthcare providers spot patterns over time.

---

## Problem Statement

Postpartum recovery is a critical period where complications can arise silently. Many mothers don't have easy access to continuous monitoring or guidance, leading to delayed intervention in high-risk situations. Healthcare providers lack real-time data on patient recovery patterns, and mothers struggle to interpret their symptoms and know when to seek help.

---

## Solution

Our app creates a structured daily tracking system that:
- **Quantifies recovery** through a scientific scoring algorithm
- **Classifies risk levels** to guide users to appropriate resources (specialists, nutritionists, or tips)
- **Visualizes trends** over 5 days to identify improvement or deterioration
- **Connects users** with verified specialists in their area
- **Provides evidence-based guidance** tailored to recovery phase

---

## Technical Details

### Technologies/Components Used

**For Software:**

- **Languages used:** JavaScript (ES6+), HTML5, CSS3
- **Frameworks used:** React 19.2, Vite 8, React Router 7
- **Libraries used:** Recharts (data visualization), Axios (HTTP), React Hook Form
- **Backend/Database:** Supabase (PostgreSQL + Auth)
- **Tools used:** VS Code, Git, npm, Netlify (deployment)

---

## Features

- **Daily Health Tracking:** Log mood (1-5), sleep hours, bleeding level, pain score, iron intake, and support level
- **Automatic Recovery Score Calculation:** Algorithm-based scoring (0-100 scale) with instant feedback
- **Risk Classification:** High Risk (0-40), Moderate Risk (41-70), Stable (71-100)
- **Recovery Trends:** Line charts showing recovery score and mood trends over the last 5 days
- **Specialist Directory:** Access to doctors, nutritionists, and mental health professionals
- **Recovery Tips:** Evidence-based guidance tailored to recovery phase
- **Delivery Details Storage:** Track delivery date, type, and location for medical context
- **Postpartum Journal:** Personal journaling space for recovery reflections
- **Secure Authentication:** Email-based auth with Supabase
- **Responsive Design:** Works on mobile and desktop devices

---

## Implementation

### Installation

```bash
# Clone the repository
git clone https://github.com/tinakurian05/tink-her-hack-temp.git
cd tinkher

# Install dependencies
npm install

# Create .env.local file and add:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run

```bash
# Development server (runs on http://localhost:5174)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Project Documentation

### Screenshots

https://drive.google.com/drive/folders/1xeYC5Fjy-IYdIMTfzBi2oceXlEMsTBLe?usp=sharing


#### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                │
│  ┌────────────────┬──────────────┬────────────────────┐ │
│  │   Dashboard    │ HealthForm   │  Trends (Recharts) │ │
│  │   Specialists  │   Journal    │      Tips          │ │
│  └────────────────┴──────────────┴────────────────────┘ │
└──────────────────────────┬────────────────────────────────┘
                           │ (HTTP/REST)
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Backend (PostgreSQL)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Auth Module  │  daily_records Table  │   RLS      │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User logs in via Supabase Auth
2. Daily health data submitted via HealthForm
3. Recovery score calculated on frontend
4. Data persisted to PostgreSQL via Supabase
5. Trends fetched and visualized with Recharts
6. RLS policies ensure users see only their own data

#### Application Workflow

```
┌──────────────┐
│   Login      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│   Dashboard (Main Hub)   │
│ - Recovery Score Display │
│ - Delivery Details       │
│ - Risk Alert System      │
└──────┬──────────┬────────┘
       │          │
       ▼          ▼
   ┌────────┐  ┌──────────────────┐
   │ Trends │  │ Daily Check-in   │
   │ Charts │  │ (Health Logging) │
   └────────┘  └────────┬─────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
        ┌─────────────┐  ┌──────────────┐
        │ Specialist  │  │ Tips/Journal │
        │ Directory   │  │ (Stable Path)│
        └─────────────┘  └──────────────┘
```

---

## API Documentation

### Base URL
```
https://your-supabase-url/rest/v1
```

### Endpoints

#### POST `/daily_records`
**Description:** Create a new daily health record

**Request Body:**
```json
{
  "user_id": "uuid",
  "mood_score": 3,
  "sleep_hours": 6,
  "bleeding_level": 2,
  "pain_score": 4,
  "iron_intake": true,
  "support_level": 2,
  "recovery_score": 65,
  "risk_level": "Moderate Risk"
}
```

**Response:**
```json
{
  "id": "record-uuid",
  "created_at": "2025-02-14T10:30:00Z",
  "status": "success"
}
```

#### GET `/daily_records`
**Description:** Fetch user's daily records (last 5 days)

**Parameters:**
- `user_id` (uuid): Authenticated user's ID
- `limit` (integer): Number of records to fetch (default: 5)

**Response:**
```json
{
  "data": [
    {
      "id": "record-uuid",
      "created_at": "2025-02-14T10:30:00Z",
      "recovery_score": 65,
      "mood_score": 3,
      "risk_level": "Moderate Risk"
    }
  ],
  "count": 5
}
```

---

## Installation Guide

### Web Application (Netlify)

1. Visit the deployed link: [Your Netlify URL]
2. Click "Sign Up" to create account
3. Enter your name, email, delivery details
4. Start logging your daily health metrics
5. View trends and access resources based on your recovery level

### Building from Source

```bash
# Install Node.js 18+

# Clone and setup
git clone https://github.com/tinakurian05/tink-her-hack-temp.git
cd tinkher
npm install

# Configure environment
# Create .env.local with Supabase credentials

# Run locally
npm run dev

# Build for production
npm run build
```

---

## Additional Documentation

### Bill of Materials (For Reference)

| Component | Purpose | Cost |
|-----------|---------|------|
| React 19.2 | Frontend Framework | Free (OSS) |
| Vite 8 | Build Tool | Free (OSS) |
| Supabase | Backend + Database | Free tier available |
| Recharts | Data Visualization | Free (OSS) |
| React Router | Client-side Routing | Free (OSS) |
| Netlify | Hosting/Deployment | Free tier available |

**Total Estimated Cost:** Free (all open-source/free tier)

---

## Team Contributions

- **[TEENA SAJI]:** Frontend development (React components, UI/UX, Recovery score calculation)
- **[TINA KURAIN V]:** Backend integration (Supabase setup, API, Testing)


---

## Demo

### Video
https://drive.google.com/drive/folders/1hQtQDSndAuL0mt978QSqzsXj8BUFYU2d?usp=sharing

**What the demo shows:**
- Signing up and entering delivery details
- Logging daily health metrics
- Recovery score calculation and risk classification
- Viewing trend charts
- Specialist recommendations based on risk level
- Journal functionality for reflection

---

## AI Tools Used

**Tool Used:** GitHub Copilot

**Purpose:**
- Generated boilerplate React component structures
- Debugging assistance for async Supabase queries
- CSS styling optimization suggestions
- Code review and documentation improvements

**Key Prompts Used:**
- "Create a React component for a daily health form with multiple input types"
- "Debug this Supabase RLS policy for user data isolation"
- "Design a recovery score calculation algorithm for postpartum health"

**Percentage of AI-generated code:** ~20% (primarily boilerplate and structure)

**Human Contributions:**
- Complete algorithm design for recovery scoring
- System architecture and database schema
- Business logic and risk classification rules
- UI/UX design decisions aligned with healthcare best practices
- Integration testing and data validation
- Project planning and feature prioritization

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ at TinkerHub

