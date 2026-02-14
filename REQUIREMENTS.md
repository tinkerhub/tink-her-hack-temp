# 📦 SHE_WANTS - Quick Installation Reference

## ⚡ TL;DR - Fastest Setup

```bash
# 1. Install Node.js from https://nodejs.org/
# 2. Run these commands:
npm install
npm run dev
# 3. Open http://localhost:5173
```

---

## 📋 Installation Requirements Summary

### Required Software
| Software | Minimum Version | Download Link |
|----------|----------------|---------------|
| Node.js | 16.x | https://nodejs.org/ |
| npm | 8.x | (Included with Node.js) |

### System Requirements
| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| RAM | 2GB | 4GB |
| Disk Space | 500MB | 1GB |
| OS | Windows 10, macOS 10.14, Ubuntu 18.04 | Latest versions |

### Browser Requirements
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Required Browser Features:**
- Geolocation API (for location-based features)
- Local Storage (for session management)
- ES6+ JavaScript support

---

## 🚀 Installation Steps

### 1. Check if Node.js is Installed
```bash
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
```

### 2. Install Node.js (if needed)

**macOS:**
```bash
# Using Homebrew
brew install node
```

**Windows:**
- Download installer from https://nodejs.org/
- Run the .msi file
- Follow installation wizard

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install Project Dependencies
```bash
cd /path/to/SHE_WANTS
npm install
```

**This installs:**
- React 18.2.0
- Vite 5.0.8
- Express 4.18.2
- SQLite3 5.1.7
- Axios 1.6.5
- bcrypt 5.1.1
- And all other dependencies

### 4. Run the Application
```bash
npm run dev
```

**This starts:**
- Frontend server on http://localhost:5173
- Backend API on http://localhost:3000
- Auto-creates SQLite database

---

## 📦 Package.json Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.5"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "sqlite3": "^5.1.7",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2"
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "vite": "^5.0.8",
  "nodemon": "^3.0.3",
  "concurrently": "^8.2.2"
}
```

---

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run server:dev` | Start backend only |
| `npm run client:dev` | Start frontend only |
| `npm run build` | Build frontend for production |

---

## 🌐 Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |

---

## 🗄️ Database

- **Type**: SQLite3
- **Location**: `server/shewants.db`
- **Auto-created**: Yes (on first run)
- **Tables**: 8 tables (users, cycles, pad_requests, helpers, posts, comments, likes, etc.)

---

## 🔐 Default Credentials

**Test Account:**
- Username: `testuser`
- Password: `password123`

**Calculator Unlock Code:** `1234=`

---

## 📱 Browser Permissions Required

### Location Access
- Required for: Pad requests, nearby requests
- How to enable:
  - Chrome: Settings → Privacy → Location
  - Firefox: Preferences → Privacy → Location
  - Safari: Preferences → Websites → Location

### Popups
- Required for: Google Maps integration
- How to enable: Allow popups for localhost:5173

---

## ⚠️ Common Issues

### "Port 3000 already in use"
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Permission denied"
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER ~/.npm
```

---

## 📊 Disk Space Breakdown

| Component | Size |
|-----------|------|
| node_modules | ~300MB |
| Source code | ~5MB |
| Database | ~1MB |
| Build output | ~2MB |
| **Total** | **~310MB** |

---

## 🎯 Minimum vs Recommended Setup

### Minimum Setup (For Testing)
- Node.js 16.x
- 2GB RAM
- 500MB disk space
- Any modern browser

### Recommended Setup (For Development)
- Node.js 18.x or 20.x
- 4GB+ RAM
- 1GB+ disk space
- Chrome/Firefox latest version
- SSD for faster npm installs

---

## 🚀 Production Deployment

For production deployment, see [INSTALLATION.md](INSTALLATION.md) for:
- Vercel deployment
- Heroku deployment
- VPS deployment
- Docker deployment
- Environment variables
- Security hardening

---

## ✅ Installation Checklist

- [ ] Node.js 16+ installed
- [ ] npm 8+ installed
- [ ] Project folder downloaded
- [ ] `npm install` completed successfully
- [ ] `npm run dev` running without errors
- [ ] Frontend accessible at localhost:5173
- [ ] Backend accessible at localhost:3000
- [ ] Can login with test credentials
- [ ] Location permission granted
- [ ] Google Maps opening correctly

---

## 📞 Need Help?

See full documentation:
- [INSTALLATION.md](INSTALLATION.md) - Detailed installation guide
- [README.md](README.md) - Project overview
- [GOOGLE_MAPS_INTEGRATION.md](GOOGLE_MAPS_INTEGRATION.md) - Maps setup
- [SISTERHOOD_CHATS.md](SISTERHOOD_CHATS.md) - Forum features

---

**Made with ❤️ for women's safety and health**
