<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# MediGo 🎯

## Basic Details

### Team Name: raiandmursh

### Team Members
- Member 1: fathimath raihana- LBS college of engineering ,kasaragod
- Member 2: khadeejath mursheeda.k - LBS college of engineering ,kasaragod

### Hosted Project Link
https://medigo.page.gd/login.php
https://medigo.page.gd/admin/admin_login.php

### Project Description
Medigo is a location-based medicine availability platform that helps users quickly find required medicines in nearby pharmacies. Pharmacies can manage their inventory in real time, while users can report issues directly to the admin for better accuracy and transparency.

### The Problem statement
Finding medicines at the right time is difficult due to the lack of real-time information about availability in nearby pharmacies. Users often visit multiple pharmacies or make repeated calls, causing delays and inconvenience, especially during emergencies.

### The Solution
Medigo provides a centralized platform where users can search medicines by name, composition, and location. Pharmacies update their stock digitally, and users can report issues to the admin, ensuring accurate data and efficient management.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: HTML,CSS,JavaScript,PHP,SQL (MySQL)
- Frameworks used: None (Core PHP, custom frontend)
- Libraries used:MySQLi (PHP extension),PHP password hashing (password_hash, password_verify),PHP sessions,Vanilla JavaScript (DOM API)
- Tools used: XAMPP,Visual Studio Code,phpMyAdmin,Web Browser

**For Hardware:**
-Not applicable (Web-based project)

---

## Features
User registration and secure login
Search medicines by name, composition, and location
Real-time medicine availability from nearby pharmacies
Pharmacy inventory management (add/update quantity)
Admin approval for pharmacies
User issue reporting system
Role-based access (User / Pharmacy / Admin)
Secure authentication and database handling

---

## Implementation

### For Software:

#### Installation
Install XAMPP
Start Apache and MySQL
Place project folder inside htdocs



#### Run
Open browser
Go to http://localhost/medigo


## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

<img width="1920" height="766" alt="pharmacy_dash" src="https://github.com/user-attachments/assets/6b2fae18-0e8f-440b-8c0a-a70f983108dd" />
This screen shows the Pharmacy Dashboard of the Medigo system. It provides a quick overview of the pharmacy’s inventory status, including the total number of medicines, total stock value, low-stock count, and expired medicines. The dashboard also includes action buttons to add new medicines and view/manage existing medicines, enabling pharmacies to efficiently control their inventory from a single interface.

*
<img width="1920" height="773" alt="user_dash" src="https://github.com/user-attachments/assets/4fed225d-f6c7-46a9-887e-8c41da04931e" />
his screen shows the User Dashboard of the Medigo system, where users can search for medicines by name, composition, and location. The search results display real-time availability details, including the pharmacy name, location, available quantity, and contact number. Users can also report issues such as incorrect information or unavailable stock directly to the admin using the integrated reporting feature, ensuring data accuracy and platform reliability.

<img width="1920" height="791" alt="admin_dash" src="https://github.com/user-attachments/assets/b15ad6b7-cd30-4778-bfc7-7b8937fce8ff" />
This screen represents the Admin Dashboard of the Medigo platform, providing a centralized overview of the system. It displays key metrics such as total registered users, total pharmacies, and pending user reports. From this dashboard, the admin can manage pharmacy approvals and review reported issues, ensuring platform integrity, accurate medicine listings, and effective system moderation.

Demo Video:
https://drive.google.com/drive/folders/1LE-mvw2JJ1WySDaoxzklRWyqulCpaAtX?usp=sharing 
#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*Explain your system architecture - components, data flow, tech stack interaction*

**Application Workflow:**

![Workflow](docs/workflow.png)
*Add caption explaining your workflow*

---

### For Hardware:

#### Schematic & Circuit

![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

#### Build Photos

![Team](Add photo of your team here)

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
