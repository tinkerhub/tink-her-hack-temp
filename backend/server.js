const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS configuration - allow both localhost and same-origin requests
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files FIRST
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath, {
  maxAge: 0, // No caching during development
  etag: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css");
    } else if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
    }
  }
}));

// ============================================
// DATA FILE PATHS
// ============================================

const USERS_FILE = path.join(__dirname, "users.json");
const CONFESSIONS_FILE = path.join(__dirname, "confessions.json");
const SESSIONS_FILE = path.join(__dirname, "sessions.json");

// Initialize data files if they don't exist
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
if (!fs.existsSync(CONFESSIONS_FILE)) fs.writeFileSync(CONFESSIONS_FILE, JSON.stringify([]));
if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, JSON.stringify({}));

// ============================================
// UTILITY FUNCTIONS
// ============================================

function loadJSON(file) {
  try {
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return file === USERS_FILE || file === CONFESSIONS_FILE ? [] : {};
  }
}

function saveJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error saving ${file}:`, err.message);
  }
}

function generateToken() {
  return "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
}

function validateSession(token) {
  if (!token) return null;
  const sessions = loadJSON(SESSIONS_FILE);
  const session = sessions[token];
  if (session) {
    // Check if session is not expired (24 hour expiry)
    const loginTime = new Date(session.loginTime).getTime();
    const currentTime = new Date().getTime();
    if (currentTime - loginTime < 24 * 60 * 60 * 1000) {
      return session;
    } else {
      // Session expired, remove it
      delete sessions[token];
      saveJSON(SESSIONS_FILE, sessions);
      return null;
    }
  }
  return null;
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

function extractToken(req) {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  // Fallback to token in body
  return req.body?.token || req.query?.token;
}

function authMiddleware(req, res, next) {
  const token = extractToken(req);
  const session = validateSession(token);

  if (!session) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized. Please login first." 
    });
  }

  req.user = session;
  next();
}

// ============================================
// API ROUTES - REGISTER
// ============================================

app.post("/api/register", async (req, res) => {
  try {
    const { admission, email, password, confirmPassword } = req.body;

    // Validation
    if (!admission?.trim() || !email?.trim() || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 6 characters" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    const users = loadJSON(USERS_FILE);
    
    // Check if user already exists
    if (users.find(u => u.admission === admission.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: "This admission number is already registered" 
      });
    }

    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: "This email is already registered" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    users.push({
      id: Date.now().toString(),
      admission: admission.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    saveJSON(USERS_FILE, users);

    return res.status(201).json({ 
      success: true, 
      message: "Registration successful! Please login." 
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during registration" 
    });
  }
});

// ============================================
// API ROUTES - LOGIN
// ============================================

app.post("/api/login", async (req, res) => {
  try {
    const { admission, password } = req.body;

    if (!admission?.trim() || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Admission number and password are required" 
      });
    }

    const users = loadJSON(USERS_FILE);
    const user = users.find(u => u.admission === admission.trim());

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admission number or password" 
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admission number or password" 
      });
    }

    // Create session
    const token = generateToken();
    const sessions = loadJSON(SESSIONS_FILE);
    sessions[token] = {
      id: user.id,
      admission: user.admission,
      email: user.email,
      loginTime: new Date().toISOString()
    };
    saveJSON(SESSIONS_FILE, sessions);

    return res.json({ 
      success: true, 
      message: "Login successful",
      token, 
      user: {
        admission: user.admission,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login" 
    });
  }
});

// ============================================
// API ROUTES - SESSION
// ============================================

app.post("/api/verify-session", (req, res) => {
  try {
    const token = extractToken(req);
    const session = validateSession(token);

    if (session) {
      return res.json({ 
        success: true, 
        user: {
          admission: session.admission,
          email: session.email
        }
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired session" 
    });
  } catch (err) {
    console.error("Verify session error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

app.post("/api/logout", (req, res) => {
  try {
    const token = extractToken(req);
    const sessions = loadJSON(SESSIONS_FILE);
    
    if (sessions[token]) {
      delete sessions[token];
      saveJSON(SESSIONS_FILE, sessions);
    }
    
    res.json({ 
      success: true, 
      message: "Logout successful" 
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

// ============================================
// API ROUTES - CONFESSIONS
// ============================================

app.post("/api/confess", authMiddleware, (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Confession cannot be empty" 
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({ 
        success: false, 
        message: "Confession is too long (maximum 500 characters)" 
      });
    }

    const confessions = loadJSON(CONFESSIONS_FILE);
    const newConfession = {
      id: Date.now(),
      text: text.trim(),
      author: req.user.admission,
      timestamp: new Date().toISOString(),
      reports: 0,
      likes: 0
    };

    confessions.push(newConfession);
    saveJSON(CONFESSIONS_FILE, confessions);

    res.status(201).json({ 
      success: true, 
      message: "Confession posted successfully!" 
    });
  } catch (err) {
    console.error("Confess error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error posting confession" 
    });
  }
});

app.get("/api/confessions", (req, res) => {
  try {
    const confessions = loadJSON(CONFESSIONS_FILE);
    // Return confessions in reverse chronological order
    const sorted = confessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ 
      success: true, 
      confessions: sorted 
    });
  } catch (err) {
    console.error("Get confessions error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching confessions" 
    });
  }
});

app.post("/api/report", authMiddleware, (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Confession ID is required" 
      });
    }

    const confessions = loadJSON(CONFESSIONS_FILE);
    const index = confessions.findIndex(c => c.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Confession not found" 
      });
    }

    confessions[index].reports = (confessions[index].reports || 0) + 1;

    // Remove if reported 3+ times
    if (confessions[index].reports >= 3) {
      confessions.splice(index, 1);
      saveJSON(CONFESSIONS_FILE, confessions);
      return res.json({ 
        success: true, 
        message: "Confession removed due to multiple reports" 
      });
    }

    saveJSON(CONFESSIONS_FILE, confessions);
    res.json({ 
      success: true, 
      message: "Confession reported successfully" 
    });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error reporting confession" 
    });
  }
});

// ============================================
// SPA FALLBACK ROUTES - MUST BE LAST
// ============================================

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

// Catch all other routes and serve index.html (SPA fallback)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`\n💝 Let's Confess Server Started`);
  console.log(`❤️  Server running at http://localhost:${PORT}`);
  console.log(`🎉 Happy Valentine's Day!\n`);
});
app.post("/api/confess", authMiddleware, (req, res) => {
  try {
    const { text, category } = req.body;
    const CATEGORIES = ["crush", "department", "confession", "life-experience", "trauma"];

    if (!text?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Confession cannot be empty" 
      });
    }

    if (!category || !CATEGORIES.includes(category)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please select a valid category" 
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({ 
        success: false, 
        message: "Confession is too long (maximum 500 characters)" 
      });
    }

    const confessions = loadJSON(CONFESSIONS_FILE);
    const newConfession = {
      id: Date.now(),
      text: text.trim(),
      category: category,
      author: req.user.admission,
      timestamp: new Date().toISOString(),
      reports: 0,
      likes: 0
    };

    confessions.push(newConfession);
    saveJSON(CONFESSIONS_FILE, confessions);

    res.status(201).json({ 
      success: true, 
      message: "Confession posted successfully!" 
    });
  } catch (err) {
    console.error("Confess error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Error posting confession" 
    });
  }
});