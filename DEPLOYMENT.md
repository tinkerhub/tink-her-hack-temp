# 🚀 SHE_WANTS - Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - **RECOMMENDED** ✅
**Best for:** Easy deployment, free tier available, automatic HTTPS

### Option 2: Netlify (Frontend) + Railway (Backend)
**Best for:** Simple setup, good free tier

### Option 3: GitHub Pages (Frontend only - Static)
**Best for:** Quick demo, no backend needed

### Option 4: Heroku (Full Stack)
**Best for:** All-in-one deployment

---

## 🌟 Option 1: Vercel + Render (RECOMMENDED)

### Part A: Deploy Frontend to Vercel

#### Step 1: Prepare Your Project
```bash
# Build the frontend
npm run build
```

#### Step 2: Deploy to Vercel

**Method 1: Using Vercel CLI (Fastest)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /Users/macbookair/Desktop/SHE_WANTS
vercel --prod
```

**Method 2: Using Vercel Website**
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

#### Step 3: Get Your Frontend URL
After deployment, you'll get a URL like:
```
https://she-wants.vercel.app
```

---

### Part B: Deploy Backend to Render

#### Step 1: Create render.yaml
Create a file `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: she-wants-backend
    env: node
    buildCommand: npm install
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

#### Step 2: Update server/index.js for Production
Add this at the top of `server/index.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

And update the CORS configuration:

```javascript
app.use(cors({
  origin: ['https://she-wants.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

#### Step 3: Deploy to Render

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `she-wants-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Instance Type: Free
6. Add Environment Variables:
   - `NODE_ENV` = `production`
7. Click "Create Web Service"

#### Step 4: Get Your Backend URL
After deployment, you'll get a URL like:
```
https://she-wants-backend.onrender.com
```

#### Step 5: Update Frontend API Configuration

Update `src/config/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD 
        ? 'https://she-wants-backend.onrender.com/api'
        : 'http://localhost:3000/api'
});

export default api;
```

#### Step 6: Redeploy Frontend
```bash
npm run build
vercel --prod
```

---

## 🎯 Option 2: Netlify + Railway

### Deploy Frontend to Netlify

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Deploy

**Using Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Using Netlify Website:**
1. Go to https://netlify.com
2. Drag and drop your `dist` folder
3. Or connect GitHub repository

### Deploy Backend to Railway

1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-detects Node.js
7. Add environment variables
8. Deploy

Your backend URL: `https://she-wants-backend.up.railway.app`

---

## 📄 Option 3: GitHub Pages (Static Demo)

**Note:** This only deploys the frontend as a static site. Backend features won't work.

#### Step 1: Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SHE_WANTS/'  // Replace with your repo name
})
```

#### Step 2: Build
```bash
npm run build
```

#### Step 3: Deploy

**Using gh-pages:**
```bash
# Install gh-pages
npm install -g gh-pages

# Deploy
gh-pages -d dist
```

**Manual Method:**
1. Go to GitHub repository settings
2. Pages → Source → Select branch `gh-pages`
3. Save

Your site: `https://yourusername.github.io/SHE_WANTS/`

---

## 🔧 Option 4: Heroku (Full Stack)

#### Step 1: Create Procfile

Create `Procfile` in project root:
```
web: npm run server:dev
```

#### Step 2: Update package.json

Add to scripts:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "heroku-postbuild": "npm run build"
  }
}
```

#### Step 3: Deploy

```bash
# Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create she-wants-app

# Deploy
git push heroku main

# Open app
heroku open
```

Your app: `https://she-wants-app.herokuapp.com`

---

## 🔐 Environment Variables for Production

Create `.env.production` file:

```env
# Backend URL
VITE_API_URL=https://she-wants-backend.onrender.com/api

# Database
DB_PATH=./server/shewants.db

# Server
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://she-wants.vercel.app
```

---

## 📝 Pre-Deployment Checklist

### Frontend
- [ ] Build succeeds (`npm run build`)
- [ ] API URL updated for production
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] All dependencies in package.json

### Backend
- [ ] Database path configured
- [ ] CORS allows frontend URL
- [ ] Port configuration correct
- [ ] All routes tested
- [ ] Error handling in place

### Database
- [ ] SQLite file included or auto-created
- [ ] Initial data seeded (if needed)
- [ ] Backup strategy in place

---

## 🚀 Quick Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Deploy backend to Render
echo "🔧 Backend deployment..."
echo "Please deploy backend manually at https://render.com"

echo "✅ Deployment complete!"
echo "Frontend: Check Vercel dashboard"
echo "Backend: Check Render dashboard"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🌍 Your Deployed URLs

After deployment, update your README.md:

```markdown
### Hosted Project Link
- **Frontend**: https://she-wants.vercel.app
- **Backend API**: https://she-wants-backend.onrender.com
- **Demo Video**: [Your YouTube link]
```

---

## 🔍 Testing Your Deployed App

### Test Frontend
1. Open your Vercel URL
2. Check if calculator loads
3. Try logging in
4. Test all features

### Test Backend
```bash
# Test API endpoint
curl https://she-wants-backend.onrender.com/api/helpers

# Test login
curl -X POST https://she-wants-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

## ⚠️ Common Deployment Issues

### Issue 1: "Cannot connect to backend"
**Solution:** 
- Check CORS settings in server/index.js
- Verify API URL in src/config/api.js
- Check backend is running on Render

### Issue 2: "Database not found"
**Solution:**
- Ensure database.js creates tables on startup
- Check file permissions
- Use persistent storage on Render

### Issue 3: "Build fails"
**Solution:**
- Run `npm run build` locally first
- Check for missing dependencies
- Verify Node.js version matches

### Issue 4: "Google Maps not working"
**Solution:**
- Ensure HTTPS is enabled (required for geolocation)
- Check browser permissions
- Verify location API is accessible

---

## 💰 Cost Breakdown

### Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Free | 100GB bandwidth/month |
| **Render** | ✅ Free | 750 hours/month, sleeps after 15min inactive |
| **Netlify** | ✅ Free | 100GB bandwidth/month |
| **Railway** | ✅ $5 credit | Limited hours |
| **Heroku** | ❌ Paid | No free tier anymore |

**Recommended:** Vercel (Frontend) + Render (Backend) = **100% FREE**

---

## 🎬 Next Steps After Deployment

1. **Test Everything**
   - All features working
   - Location permissions
   - Google Maps integration
   - Database operations

2. **Update README**
   - Add hosted links
   - Add screenshots
   - Add demo video

3. **Monitor**
   - Check Vercel analytics
   - Monitor Render logs
   - Watch for errors

4. **Optimize**
   - Enable caching
   - Compress images
   - Minify code

---

## 📊 Deployment Status Dashboard

Create this in your README:

```markdown
## 🌐 Live Demo

| Service | Status | URL |
|---------|--------|-----|
| Frontend | 🟢 Live | https://she-wants.vercel.app |
| Backend | 🟢 Live | https://she-wants-backend.onrender.com |
| Database | 🟢 Active | SQLite on Render |
```

---

## 🎯 Recommended: Vercel + Render

**Why this combo?**
- ✅ 100% Free
- ✅ Automatic HTTPS
- ✅ Easy deployment
- ✅ Good performance
- ✅ Auto-scaling
- ✅ CI/CD built-in

**Deployment time:** ~10 minutes

---

## 📞 Need Help?

If deployment fails:
1. Check deployment logs
2. Verify all environment variables
3. Test locally first
4. Check CORS settings
5. Ensure database is accessible

---

**Ready to deploy?** Start with Option 1 (Vercel + Render) for the easiest experience! 🚀
