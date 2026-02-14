# 🌸 SHE_WANTS - Installation & Deployment Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Deployment Options](#deployment-options)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 500MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

### Check Your Current Versions
```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
```

---

## 📦 Installation Steps

### 1. **Install Node.js and npm**

#### On macOS:
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

#### On Windows:
```bash
# Download installer from https://nodejs.org/
# Run the installer and follow the prompts
```

#### On Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. **Clone or Download the Project**

```bash
# If you have the project folder
cd /path/to/SHE_WANTS

# Or if downloading from repository
git clone <repository-url>
cd SHE_WANTS
```

### 3. **Install Dependencies**

```bash
# Install all required packages
npm install
```

This will install:
- **Frontend**: React, Vite, Axios
- **Backend**: Express, SQLite3, CORS, Body-parser
- **Dev Tools**: Nodemon, Concurrently

### 4. **Initialize Database**

The database will be automatically created when you first run the server. It includes:
- Users table
- Cycles table (period tracking)
- Pad requests table
- Community helpers table
- Sisterhood posts, comments, and likes tables

---

## 🚀 Running the Application

### Development Mode (Recommended for Testing)

```bash
# Start both frontend and backend servers
npm run dev
```

This command runs:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express API server)

### Run Servers Separately

```bash
# Terminal 1: Start backend only
npm run server:dev

# Terminal 2: Start frontend only
npm run client:dev
```

### Production Build

```bash
# Build the frontend for production
npm run build

# The built files will be in the 'dist' folder
# You can serve these with any static file server
```

---

## 🌐 Deployment Options

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel):
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

#### Backend (Railway):
1. Go to https://railway.app
2. Create new project
3. Connect your GitHub repository
4. Set environment variables
5. Deploy

### Option 2: Deploy to Heroku (Full Stack)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create she-wants-app

# Deploy
git push heroku main
```

### Option 3: Deploy to VPS (DigitalOcean, AWS, etc.)

```bash
# On your VPS:
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone your project
git clone <your-repo>
cd SHE_WANTS

# 3. Install dependencies
npm install

# 4. Install PM2 (process manager)
sudo npm install -g pm2

# 5. Start the application
pm2 start npm --name "she-wants-backend" -- run server:dev
pm2 start npm --name "she-wants-frontend" -- run client:dev

# 6. Make it start on boot
pm2 startup
pm2 save

# 7. Setup Nginx as reverse proxy (optional)
sudo apt install nginx
# Configure nginx to proxy to localhost:5173 and localhost:3000
```

### Option 4: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000 5173

CMD ["npm", "run", "dev"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "5173:5173"
    volumes:
      - ./server/shewants.db:/app/server/shewants.db
```

Run:
```bash
docker-compose up -d
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DB_PATH=./server/shewants.db

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Session Secret (for production)
SESSION_SECRET=your-secret-key-here

# Google Maps API (if needed for enhanced features)
GOOGLE_MAPS_API_KEY=your-api-key-here
```

---

## 📱 Browser Requirements

### Required Browser Features:
- ✅ **Geolocation API** - For location-based features
- ✅ **Local Storage** - For session management
- ✅ **ES6+ Support** - Modern JavaScript
- ✅ **Fetch API** - For API calls

### Enable Location Services:
1. **Chrome**: Settings → Privacy and Security → Site Settings → Location
2. **Firefox**: Preferences → Privacy & Security → Permissions → Location
3. **Safari**: Preferences → Websites → Location

---

## 🛠️ Troubleshooting

### Issue: "Port 3000 already in use"
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run server:dev
```

### Issue: "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Database locked"
```bash
# Stop all running servers
# Delete the database file
rm server/shewants.db

# Restart the server (database will be recreated)
npm run server:dev
```

### Issue: "CORS errors"
- Make sure both frontend and backend are running
- Check that CORS is enabled in `server/index.js`
- Verify the API base URL in `src/config/api.js`

### Issue: "Location not working"
- Enable location services in browser
- Use HTTPS in production (required for geolocation)
- Check browser console for permission errors

---

## 📊 Project Structure

```
SHE_WANTS/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── config/            # API configuration
│   └── index.css          # Styles
├── server/                # Backend code
│   ├── index.js           # Express server
│   ├── database.js        # Database initialization
│   └── shewants.db        # SQLite database
├── public/                # Static files
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── README.md              # Documentation
```

---

## 🔒 Security Considerations

### For Production Deployment:

1. **Use HTTPS**: Required for geolocation and secure data
2. **Environment Variables**: Never commit `.env` files
3. **Password Hashing**: Currently uses bcrypt (already implemented)
4. **CORS Configuration**: Restrict to your domain only
5. **Rate Limiting**: Add rate limiting to prevent abuse
6. **Input Validation**: Validate all user inputs (already implemented)
7. **SQL Injection Prevention**: Using parameterized queries (already implemented)

### Recommended Security Additions:

```bash
# Install security packages
npm install helmet express-rate-limit

# Add to server/index.js:
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

---

## 📈 Performance Optimization

### For Production:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Serve static files from backend**:
   ```javascript
   // In server/index.js
   app.use(express.static('dist'));
   ```

3. **Enable compression**:
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

4. **Database optimization**:
   - Add indexes to frequently queried columns
   - Use connection pooling for high traffic

---

## 📞 Support

### Common Commands:

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Start backend only
npm run server:dev

# Start frontend only
npm run client:dev

# Check for updates
npm outdated

# Update packages
npm update
```

---

## ✅ Quick Start Checklist

- [ ] Node.js 16+ installed
- [ ] npm 8+ installed
- [ ] Project downloaded/cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Servers running (`npm run dev`)
- [ ] Browser opened to http://localhost:5173
- [ ] Location permissions enabled
- [ ] Test account created

---

## 🎉 You're Ready!

Your SHE_WANTS application should now be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

**Default Test Account**:
- Username: `testuser`
- Password: `password123`

**Calculator Lock Code**: `1234=`

Enjoy your application! 🌸
