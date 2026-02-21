<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# Serenis🎯

## Basic Details: Serenis is a full-stack web application designed to provide a simple and user-friendly platform for managing and interacting with data efficiently.
The project focuses on clean design, modular code structure, and practical implementation of backend and frontend concepts.

### Team Name: AstroBytes

### Team Members
- Member 1:Archana P S - College of engineering attingal 
- Member 2: [Name] - College of engineering attingal 

### Hosted Project Link
serenis-pi.vercel.app
### Project Description
Serenis is a simple wellness journaling application that helps users record daily thoughts in a calendar-based journal and track mood patterns over time. It supports multiple members, allowing each user to maintain personal entries while gaining insights into emotional trends.

### The Problem statement
Many individuals experience emotional stress, anxiety, and mood fluctuations but lack simple, private, and accessible tools to understand and manage their mental well-being. Existing mental health platforms are often complex, expensive, or intimidating, making users reluctant to seek help or track their emotions regularly.

There is a need for a beginner-friendly, science-backed system that can analyze users’ emotions through text and voice, track moods over time, and provide immediate emotional support and self-regulation techniques during moments of distress.

Serenis aims to address this gap by offering a lightweight emotional wellness assistant that helps users:

Express feelings through journaling and voice input

Detect emotional patterns and early distress signals

Receive timely, evidence-based emotional regulation and self-soothing guidance

### The Solution
Serenis is a text and voice–based emotional wellness chatbot that detects user emotions in real time and provides science-backed emotional regulation support in a friendly, age-appropriate conversational style.

The system analyzes text messages and voice inputs to identify emotional states such as stress, anxiety, sadness, or emotional overload. Based on the detected emotion, Serenis dynamically adapts its tone and response style, allowing users to either vent freely or receive guidance, making them feel heard and safe.

Key Functionalities
1. Emotion Detection (Text + Voice)

Uses NLP for text sentiment and emotion analysis

Uses voice emotion analysis (tone, pitch, energy) via free APIs

Detects states like calm, stressed, anxious, low mood, or overwhelmed

2. Supportive Conversational Response

Adjusts language, tone, and empathy level to match the user’s emotional state

Speaks like a supportive friend rather than a clinical assistant

Avoids judgment and promotes openness

3. Advice vs Vent Toggle

Users choose whether they want solutions or just emotional release

Prevents overwhelming users during vulnerable moments

4. Crisis Awareness & Immediate Support

Detects panic/anxiety signals and activates calming interventions

Recognizes suicidal ideation keywords and responds with grounding support, reassurance, and help-seeking encouragement

Focuses on support, not diagnosis

5. Science-Backed Emotional Regulation Tools

60-Second Reset (paced breathing, grounding)

Thought Reframing (CBT-inspired)

Self-soothing techniques (sensory calming, reassurance prompts)

Break-and-Restart method for emotional overload

6. Journal + Mood Tracking

Daily journaling saved in a calendar-style view

Automatically tracks emotional trends from journal entries

Highlights micro-wins and emotional improvements

7. Night Awareness

Detects late-night vulnerability

Suggests sleep-friendly grounding techniques and reflection prompts

Why Serenis Is Unique

Combines voice + text emotion analysis

Uses scientifically backed emotional regulation techniques

Beginner-friendly, hackathon-feasible architecture

Focuses on comfort, awareness, and recovery, not therapy replacement

Impact

Serenis empowers users to:

Understand their emotions better

Regulate distress safely and privately

Build emotional awareness over time

Feel supported during vulnerable moments

## Technical Details
Technical Details
System Overview

Serenis is a lightweight web-based emotional wellness chatbot that performs text and voice emotion analysis and responds with science-backed emotional regulation techniques.

The system is designed with a simple frontend + minimal backend + third-party APIs, making it hackathon-friendly and scalable.

Architecture
User (Browser)
   ↓
Frontend (React / HTML + JS)
   ↓
Backend API (Node.js / Flask)
   ↓
Emotion APIs + LLM
   ↓
Response + Exercises
   ↓
Database (MySQL) – Journals & Mood History
Technology Stack
Frontend

HTML / CSS / JavaScript (or React if comfortable)

Voice input using Web Speech API

Text chat interface

Calendar-based journal UI

Advice vs Vent toggle

Micro-win and mood display

Backend

Node.js (Express) or Python (Flask)

Handles:

API calls

Emotion analysis logic

Safety & crisis detection

Journal storage

Mood tracking

Emotion Detection
1. Text Emotion Analysis

Uses Hugging Face free inference APIs

Example models:

j-hartmann/emotion-english-distilroberta-base

cardiffnlp/twitter-roberta-base-emotion

Output emotions:

happy, calm, anxious, sad, angry, overwhelmed

2. Voice Emotion Analysis

Voice captured in browser

Converted to text using:

Web Speech API or Whisper (API)

Emotion inferred from:

Speech energy

Pauses

Word choice

(Hackathon-level approximation, not medical diagnosis)

Conversational Intelligence
LLM (Chat Response)

OpenAI / Open-source LLM (API-based)

Prompted to:

Speak like a supportive friend

Match user’s emotional tone

Avoid clinical language

Follow safety constraints

Advice vs Vent Logic
IF mode == "Vent":
   → Empathy + validation
ELSE:
   → Emotional regulation exercises
Crisis & Safety Detection
Panic / Anxiety Detection

Triggered when:

High anxiety emotion score

Keywords like: panic, can’t breathe, heart racing

Response:

60-Second Reset

Grounding exercise

Slow breathing prompts

Comforting language

Suicidal Ideation Detection

Keyword + sentiment based:

“I want to disappear”

“No reason to live”

“I want to die”

Action:

Non-judgmental support

Encouragement to seek help

Emergency resources (region-based)

Never gives medical advice or instructions

Science-Backed Interventions
Implemented Methods

CBT-inspired thought reframing

Box breathing / paced breathing

5-4-3-2-1 grounding

Self-soothing prompts

Break & Restart method

Night-time calming routines

All responses are evidence-informed, not diagnostic.

Journal & Mood Tracking
Database (MySQL)

Yes — MySQL is used.

Tables:

users

journal_entries

daily_mood

Each journal entry stores:

Date

Text

Detected emotion

Mood score

Features

Calendar-based journaling

Mood trend visualization

Micro-wins extraction

Emotional pattern awareness

Privacy & Ethics

No diagnosis or labeling

Minimal data storage

No voice stored permanently

Users control journal visibility

Clear mental health disclaimer

Role Division (2 Members)
Member 1 – AI & Backend

Emotion detection APIs

Chat response logic

Safety & crisis handling

MySQL integration

Member 2 – Frontend & UX

Chat UI

Voice input

Journal calendar

Mood visualization

User flow & comfort design

Hackathon Feasibility

Uses free APIs

Minimal backend logic

Modular design

Expandable after hackathon
### Technologies/Components Used
Technologies / Components Used

Frontend: HTML, CSS, JavaScript (React optional)

Voice Input: Web Speech API

Backend: Node.js (Express) / Python (Flask)

AI & NLP: Hugging Face Emotion Detection Models, LLM (Chat API)

Speech-to-Text: Browser Speech API / Whisper API

Database: MySQL (Journal & Mood Tracking)

APIs: Emotion Analysis API, Chat Response API

Features: Text & Voice Chat, Emotion Detection, Journaling, Mood Tracking, Safety Detection
**For Software:**
-Software Used

Operating System: Windows / Linux

Programming Languages: JavaScript, Python

Frontend Software: HTML, CSS, JavaScript

Backend Frameworks: Node.js (Express) / Flask

AI Libraries: Hugging Face Transformers, TensorFlow / PyTorch

Database Software: MySQL

APIs & Tools: Speech-to-Text API, Emotion Analysis API

Version Control: Git, GitHub

IDE: VS Code
**For Hardware:**
Processor: Intel i3 or above

RAM: 4 GB or more

Storage: 20 GB free space

Microphone: Built-in or external (for voice emotion analysis)

Internet Connection: Required

## Features

Text and voice-based chatbot interaction

Basic emotion detection from user input

Advice vs Vent mode toggle

Panic/anxiety support with calming exercises

Thought reframing and emotional regulation techniques

Calendar-based journaling with mood tracking

Night-time emotional awareness prompts

## Implementation
The system is implemented as a web-based application where users interact with a chatbot using text or voice. User input is analyzed using emotion detection models to identify emotional states. Based on the detected emotion, the system provides appropriate, science-backed responses such as calming exercises, emotional regulation techniques, or supportive conversation. Journal entries are stored in a database and visualized in a calendar format to track mood patterns over time.
### For Software:
The application is developed using HTML, CSS, and JavaScript for the frontend interface. The backend is built using Node.js or Flask to handle user requests and API communication. Emotion detection is performed using pre-trained AI models accessed through APIs. User journal entries and mood data are stored using MySQL. Git and GitHub are used for version control and collaboration.
#### Installation
Install Node.js / Python on the system.

Clone the project repository from GitHub.

Navigate to the project folder.

Install required dependencies using the package manager.

Configure environment variables for API keys and database connection.

Run the backend server.

Open the frontend in a web browser.
#### Run
Start the backend server.

Open the frontend application in a browser.

Allow microphone access for voice input.

Begin interacting with SERENIS using text or voice.

### For Hardware:
Power on the system (PC / Laptop).

Connect and enable a working microphone.

Ensure speakers or headphones are connected.

Launch the application and grant microphone access.

Interact with SERENIS using voice or text input.
#### Components Required
Software

Web Browser (Chrome / Edge)

Node.js / Python (for backend)

OpenAI API

MySQL Database

Hardware

Laptop / Desktop

Microphone

Speakers / Headphones

Internet Connection

#### Circuit Setup
Project Data Flow (Digital Circuit)Input Stage: The User Interface (HTML/CSS/JS) captures emotional data via text input or the Web Speech API (Voice input).Processing Bridge: Data is sent via REST API calls (Express.js) to the backend logic.Logic Gate (AI): The chatService.js and emotionService.js act as the central processors, analyzing sentiment and generating empathetic responses.Storage (Memory): * Short-term: Local Storage holds immediate session moods.Long-term: MySQL Database acts as the permanent memory for history and user profiles.Output Stage: The UI renders the AI's response and updates the Cosmic Grid (Mood Calendar) based on the processed data.Logical ConnectionsFrontend $\rightarrow$ Node.js Server (via HTTP POST)Server $\rightarrow$ AI API (for Sentiment Analysis)Server $\rightarrow$ MySQL (via db.js for persistence)Backend $\rightarrow$ Frontend (JSON response to update the UI)

## Project Documentation
1. Abstract / Executive SummarySerenis is a full-stack mental health application designed to serve as a digital sanctuary. It utilizes a glassmorphic "Sea Wave" interface to provide immediate sensory relief while leveraging an AI-powered backend to offer empathetic counseling. The system bridges the gap between high-tech AI and high-touch emotional support through real-time sentiment analysis, visual mood history, and guided mindfulness tools.2. Problem StatementModern digital environments often exacerbate mental fatigue through high-stress interfaces. Existing wellness tools often feel clinical or transactional, lacking the privacy and the immediate, calming sensory engagement required for effective emotional processing.3. Proposed SolutionSerenis addresses this by providing an "intentional space" featuring:Fluid UI: Rhythmic animations to lower cortisol and induce flow state.Dual-Mode AI: Adapting between "Vent" (listening) and "Advice" (coaching) modes.Life-Tide Mapping: Transforming abstract emotions into a tangible, color-coded visual timeline.4. Software Architecture & TechnologiesThe project follows a modular Full-Stack JavaScript architecture.Languages: JavaScript (ES6+), HTML5, CSS3, SQL.Frameworks: Express.js (Node.js).Libraries: dotenv, mysql2, cors, Web Speech API.Tools: VS Code, Git, NPM, MySQL Workbench.5. Implementation DetailsThe software logic is divided into specialized layers to ensure security and performance:LayerComponentFunctionalityFrontendserenis-frontendManages the glassmorphic UI, local state, and Speech-to-Text.Backendserver.jsHandles API requests and environment configuration.RoutingchatRoutes.jsDirects emotional data to the appropriate processing services.ServicesemotionService.jsAnalyzes user sentiment to determine "Sea Spirit" mood.Persistencedb.jsManages the connection pool for the MySQL database.6. Key FeaturesAdaptive AI Counseling: Context-aware responses generated via the Gemini/AI API.Cosmic Grid History: A visual calendar populated from local and database storage.Cinematic Breathing: A mindfulness module using CSS keyframe pulses for 4-7-8 breathing.Voice-to-Soul: Real-time speech transcription for hands-free venting.7. Installation & SetupDependencies: Run npm install in the serenis-backend folder.Environment: Create a .env file with DB_HOST, DB_USER, DB_PASS, and AI_API_KEY.Database: Import the SQL schema to initialize the MySQL tables.Execution: Run npm start for the backend and launch index.html via Live Server.8. ConclusionSerenis demonstrates the potential of combining aesthetic design with AI logic to create a proactive mental wellness tool. By storing data locally for privacy and on a server for history, it provides a secure and restorative user experience.
### For Software:
The software follows a Modular Full-Stack Architecture, separating the visual interface from the logic-heavy backend services to ensure a responsive, therapeutic user experience.

Frontend (The UI Sanctuary): Implemented using HTML5, CSS3, and Vanilla JavaScript. It utilizes Glassmorphism for a calming aesthetic and the Web Speech API for real-time voice-to-text processing.

Backend (The Intelligence Hub): A Node.js and Express.js environment that handles API requests. It uses chatRoutes.js to direct emotional data through specialized logic services.

Service Layer: Dedicated modules like chatService.js (AI integration) and emotionService.js (sentiment analysis) process user input to provide empathetic, context-aware responses.

Data Management: A dual-storage system using Local Storage for immediate mood tracking and MySQL (via db.js) for persistent, long-term history and user profiles.
#### Screenshots (Add at least 3)

<img width="1600" height="896" alt="image" src="https://github.com/user-attachments/assets/4e4cdad0-af7c-4578-adc1-a6fc596de3c3" />


<img width="1600" height="899" alt="image" src="https://github.com/user-attachments/assets/e439f4c7-87b6-4ebd-9603-1aa3db7e507d" />

<img width="1600" height="891" alt="image" src="https://github.com/user-attachments/assets/b76a0c06-3801-42cf-b708-e9dd6db48847" />


<img width="1600" height="899" alt="image" src="https://github.com/user-attachments/assets/258841e5-e58a-4943-bf3e-50d482326176" />


#### Diagrams
graph TD
    subgraph Client_Side [Frontend: The Sanctuary]
        UI[Glassmorphic UI - HTML/CSS]
        JS[App Logic - Vanilla JS]
        LS[(Local Storage)]
        Voice[Web Speech API]
    end

    subgraph Server_Side [Backend: The Intelligence Hub]
        Express[Express.js Server]
        Routes[chatRoutes.js]
        
        subgraph Services [Service Layer]
            ES[emotionService.js]
            CS[chatService.js]
            TR[thoughtReframe.js]
        end
    end

    subgraph Data_AI_External [External & Persistence]
        DB[(MySQL Database)]
        Gemini[Gemini AI API]
    end

    %% Connections
    UI <--> JS
    JS <--> LS
    JS <--> Voice
    JS -- REST API / JSON --> Express
    Express --> Routes
    Routes --> ES
    Routes --> CS
    CS --> TR
    CS -- API Call --> Gemini
    Express -- db.js --> DB
    Routes -- Response --> JS
**System Architecture:**

High-Level System Architecture
The architecture is divided into three primary tiers:

1. Presentation Tier (Frontend)
Technology: HTML5, CSS3, Vanilla JavaScript.

Function: This is the "Sanctuary." It renders the glassmorphic UI and handles rhythmic animations.

Edge Processing: Uses the Web Speech API for local audio-to-text conversion and Local Storage for immediate, low-latency mood logging.

2. Application Tier (Backend)
Technology: Node.js, Express.js.

Function: Acts as the "Brain." It manages API endpoints defined in chatRoutes.js.

Services:

chatService.js: Interfaces with the Gemini AI for empathetic response generation.

emotionService.js: Performs sentiment analysis to trigger UI changes (mood icons/colors).

thoughtReframe.js: A utility layer that restructures negative inputs into constructive reflections.

3. Data Tier (Persistence)
Technology: MySQL.

Function: Acts as the "Memory." It stores user credentials, encrypted journal entries, and long-term emotional history via the db.js connector.

System Architecture Diagram
Component Interaction Flow
Request: User inputs a thought via text or voice in the Frontend.

Transmission: The frontend sends a JSON payload to the Express Server via a RESTful POST request.

Analysis: The server passes the data through the Service Layer to determine emotion and generate an AI response.

Storage: The interaction is logged into the MySQL Database for the "Cosmic Grid" history.

Response: The server sends back the AI response and mood metadata, which the Frontend uses to update the UI animations and chat bubbles.
**Application Workflow:**

![Workflow](docs/workflow.png)
*Add caption explaining your workflow*

---

### For Hardware:

#### Schematic & Circuit
Since Serenis is a software-based application rather than a physical hardware project, the "schematic" refers to the logical data flow rather than electrical wiring.

System Schematic (Data Flow)
The "circuit" is a closed-loop system where emotional data is processed and returned as therapeutic feedback:

Input Node: User provides text/voice data via the Frontend (HTML/JS).

Signal Transmission: Data travels via HTTP/JSON to the Express.js API.

Processing Unit: The Service Layer (emotionService.js & chatService.js) processes the signal using AI logic.

Memory Storage: Results are written to the MySQL Database (Long-term) and Local Storage (Short-term).

Output Node: The system sends a response back to the UI, triggering CSS animations and chat updates.

The "Circuit" Summary
Controller: Node.js (Express)

Sensors: Web Speech API / Input Forms

Processor: Gemini AI API

Memory: MySQL / Local Storage

Display: Glassmorphic CSS UI
![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

#### Build Photos

<img width="1152" height="864" alt="image" src="https://github.com/user-attachments/assets/eda1e0d6-35a4-4ddb-8c5a-c5664a77adfd" />


![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://api.yourproject.com`

##### Endpoints

**GET /api/endpoint**
- **Description:** [What it does]
- **Parameters:**
  - `param1` (string): [Description]
  - `param2` (integer): [Description]
- **Response:**
```json
{
  "status": "success",
  "data": {}
}
```

**POST /api/endpoint**
- **Description:** [What it does]
- **Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```
- **Response:**
```json
{
  "status": "success",
  "message": "Operation completed"
}
```

[Add more endpoints as needed...]

---

### For Mobile Apps:

#### App Flow Diagram

![App Flow](docs/app-flow.png)
*Explain the user flow through your application*

#### Installation Guide

**For Android (APK):**
1. Download the APK from [Release Link]
2. Enable "Install from Unknown Sources" in your device settings:
   - Go to Settings > Security
   - Enable "Unknown Sources"
3. Open the downloaded APK file
4. Follow the installation prompts
5. Open the app and enjoy!

**For iOS (IPA) - TestFlight:**
1. Download TestFlight from the App Store
2. Open this TestFlight link: [Your TestFlight Link]
3. Click "Install" or "Accept"
4. Wait for the app to install
5. Open the app from your home screen

**Building from Source:**
```bash
# For Android
flutter build apk
# or
./gradlew assembleDebug

# For iOS
flutter build ios
# or
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug
```

---

### For Hardware Projects:

#### Bill of Materials (BOM)

| Component | Quantity | Specifications | Price | Link/Source |
|-----------|----------|----------------|-------|-------------|
| Arduino Uno | 1 | ATmega328P, 16MHz | ₹450 | [Link] |
| LED | 5 | Red, 5mm, 20mA | ₹5 each | [Link] |
| Resistor | 5 | 220Ω, 1/4W | ₹1 each | [Link] |
| Breadboard | 1 | 830 points | ₹100 | [Link] |
| Jumper Wires | 20 | Male-to-Male | ₹50 | [Link] |
| [Add more...] | | | | |

**Total Estimated Cost:** ₹[Amount]

#### Assembly Instructions

**Step 1: Prepare Components**
1. Gather all components listed in the BOM
2. Check component specifications
3. Prepare your workspace
![Step 1](images/assembly-step1.jpg)
*Caption: All components laid out*

**Step 2: Build the Power Supply**
1. Connect the power rails on the breadboard
2. Connect Arduino 5V to breadboard positive rail
3. Connect Arduino GND to breadboard negative rail
![Step 2](images/assembly-step2.jpg)
*Caption: Power connections completed*

**Step 3: Add Components**
1. Place LEDs on breadboard
2. Connect resistors in series with LEDs
3. Connect LED cathodes to GND
4. Connect LED anodes to Arduino digital pins (2-6)
![Step 3](images/assembly-step3.jpg)
*Caption: LED circuit assembled*

**Step 4: [Continue for all steps...]**

**Final Assembly:**
![Final Build](images/final-build.jpg)
*Caption: Completed project ready for testing*

---

### For Scripts/CLI Tools:

#### Command Reference

**Basic Usage:**
```bash
python script.py [options] [arguments]
```

**Available Commands:**
- `command1 [args]` - Description of what command1 does
- `command2 [args]` - Description of what command2 does
- `command3 [args]` - Description of what command3 does

**Options:**
- `-h, --help` - Show help message and exit
- `-v, --verbose` - Enable verbose output
- `-o, --output FILE` - Specify output file path
- `-c, --config FILE` - Specify configuration file
- `--version` - Show version information

**Examples:**

```bash
# Example 1: Basic usage
python script.py input.txt

# Example 2: With verbose output
python script.py -v input.txt

# Example 3: Specify output file
python script.py -o output.txt input.txt

# Example 4: Using configuration
python script.py -c config.json --verbose input.txt
```

#### Demo Output

**Example 1: Basic Processing**

**Input:**
```
This is a sample input file
with multiple lines of text
for demonstration purposes
```

**Command:**
```bash
python script.py sample.txt
```

**Output:**
```
Processing: sample.txt
Lines processed: 3
Characters counted: 86
Status: Success
Output saved to: output.txt
```

**Example 2: Advanced Usage**

**Input:**
```json
{
  "name": "test",
  "value": 123
}
```

**Command:**
```bash
python script.py -v --format json data.json
```

**Output:**
```
[VERBOSE] Loading configuration...
[VERBOSE] Parsing JSON input...
[VERBOSE] Processing data...
{
  "status": "success",
  "processed": true,
  "result": {
    "name": "test",
    "value": 123,
    "timestamp": "2024-02-07T10:30:00"
  }
}
[VERBOSE] Operation completed in 0.23s
```

---

## Project Demo

### Video
https://drive.google.com/file/d/1mcroKAQs-mgdYSxe23jIlys7aMMtKmsL/view?usp=sharing
### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** [e.g., GitHub Copilot, v0.dev, Cursor, ChatGPT, Claude]

**Purpose:** [What you used it for]
- Example: "Generated boilerplate React components"
- Example: "Debugging assistance for async functions"
- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- [Name 1]: [Specific contributions - e.g., Frontend development, API integration, etc.]
- [Name 2]: [Specific contributions - e.g., Backend development, Database design, etc.]
- [Name 3]: [Specific contributions - e.g., UI/UX design, Testing, Documentation, etc.]

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
