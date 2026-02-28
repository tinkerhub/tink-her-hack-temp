<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# HelpNearby 🎯

## Basic Details

### Team Name: Binary

### Team Members
- Member 1: Avnita Bimal - College of Engineering, Trivandrum
- Member 2: Inayath Illyas - College of Engineering, Trivandrum

### Hosted Project Link

### Project Description
HelpNearby is a hyperlocal community help platform designed for college campuses.
It allows students to post urgent requests, offer help to peers, and earn activity points through meaningful contributions - all in one structured platform instead of messy WhatsApp groups.

### The Problem statement
In college campuses:
  Help requests are scattered across WhatsApp groups.
  Important urgent needs get lost in chats.
  No accountability for resolving requests.
  No structured tracking of who helped.
  No motivation or reward system.
This leads to inefficiency and missed opportunities to support peers.

### The Solution
HelpNearby provides:
  A centralized help-request platform
  Urgency-based categorization
  Structured request tracking
  Activity-based reward system
  Live leaderboard for contributors
Built as a lightweight MVP using HTML, CSS, JavaScript, and LocalStorage - ensuring easy deployment and scalability.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: HTML, CSS, JavaScript
- Frameworks used: None
- Libraries used: None
- Tools used: VS Code, GitHub

**For Hardware:**
- Main components: [List main components]
- Specifications: [Technical specifications]
- Tools required: [List tools needed]

---

## Features

List the key features of your project:
- User Authentication:
    College email-based signup/login
    Session persistence
    Points tracking per user
- Post Help Requests:
    Title
    Description
    Category selection
    Urgency selection (Low / Medium / High)
    Contact information
- Smart Points System:
    +2 for posting request
    +10 for helping someone
    +15 if urgency is High
    +5 bonus for resolving within 1 hour
- Request Tracking:
    Each request stores:
      Posted by
      Helped by
      Created time
      Resolved time
      Status (Open / Resolved / Expired)
- Live Leaderboard:
    Sorted dynamically by points
    Displays top contributors
    Encourages community participation
---

## Implementation

### For Software: No installation required

#### Installation
git clone https://github.com/CodeWithInayath/helpnearby.git
cd helpnearby

#### Run
index.html
Or use Live Server in VS Code.

### For Hardware:

#### Components Required
[List all components needed with specifications]

#### Circuit Setup
[Explain how to set up the circuit]

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![Guest_page.jpeg]Landing Page
Guest users can post urgent requests without login.

![login_page.jpeg]Login Page
College email-based authentication system.

![dashboard.jpeg]Dashboard + Leaderboard
Users can post, help, and track points through leaderboard.

#### Diagrams

**System Architecture:**

![Architecture Diagram](architecture.png)
Frontend built using HTML, CSS, JS
Data stored in LocalStorage
No backend server (MVP mode)
User → UI → JS Logic → LocalStorage → UI update

**Application Workflow:**

![Workflow](docs/workflow.png)
User signs up/login
User posts request
Request stored in LocalStorage
Another user marks as resolved
Points awarded dynamically
Leaderboard updates

---

### For Hardware:

#### Schematic & Circuit

![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

#### Build Photos

![Team](Add photo of your team here)

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
Data Model Structure
User Object
{
  "email": "ktuid@cet.ac.in",
  "password": "hashed_or_plain_mvp",
  "points": 120,
  "helpedCount": 5,
  "postedCount": 3
}
Request Object
{
  "id": 170000000,
  "title": "Need Charger",
  "description": "Type C charger urgently",
  "category": "Academic",
  "urgency": "High",
  "postedBy": "user@cet.ac.in",
  "helpedBy": "helper@cet.ac.in",
  "createdAt": "ISO Timestamp",
  "resolvedAt": "ISO Timestamp",
  "status": "Resolved"
}

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
[Add your demo video link here - YouTube, Google Drive, etc.]

*Explain what the video demonstrates - key features, user flow, technical highlights*

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
Avnita Bimal:
UI implementation
LocalStorage integration
Form validation
CSS styling

Inayath Illyas:
Architecture design
Points system logic
Leaderboard algorithm
Request tracking system
Documentation and deployment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
