# 🚀 SHE_WANTS - Quick Deployment Instructions

## ✅ Your App is Ready to Deploy!

The build completed successfully. Here's how to deploy it:

---

## 🌟 FASTEST METHOD: Vercel (Frontend) + Render (Backend)

### Part 1: Deploy Frontend to Vercel (5 minutes)

#### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel (opens browser)
vercel login

# 3. Deploy from your project folder
cd /Users/macbookair/Desktop/SHE_WANTS
vercel --prod
```

**Follow the prompts:**
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **she-wants** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **No**

**You'll get a URL like:** `https://she-wants.vercel.app`

#### Option B: Using Vercel Website

1. Go to https://vercel.com
2. Click "Sign Up" or "Login" (use GitHub)
3. Click "Add New..." → "Project"
4. Click "Import Git Repository"
5. If not connected, connect your GitHub account
6. Select your SHE_WANTS repository
7. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
8. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://she-wants-backend.onrender.com` (we'll create this next)
9. Click "Deploy"

**Wait 2-3 minutes for deployment to complete.**

---

### Part 2: Deploy Backend to Render (10 minutes)

#### Step 1: Push Your Code to GitHub (if not already)

```bash
cd /Users/macbookair/Desktop/SHE_WANTS

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repository and push
# (Follow GitHub instructions to create a new repository)
git remote add origin https://github.com/YOUR_USERNAME/SHE_WANTS.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Render

1. Go to https://render.com
2. Click "Sign Up" or "Login" (use GitHub)
3. Click "New +" → "Web Service"
4. Click "Connect GitHub" and authorize Render
5. Select your **SHE_WANTS** repository
6. Configure:
   - **Name**: `she-wants-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: **Free**
7. Click "Advanced" and add Environment Variables:
   - **NODE_ENV**: `production`
   - **FRONTEND_URL**: `https://she-wants.vercel.app` (your Vercel URL)
8. Click "Create Web Service"

**Wait 5-10 minutes for deployment.**

**You'll get a URL like:** `https://she-wants-backend.onrender.com`

#### Step 3: Update Frontend with Backend URL

1. Go back to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Edit `VITE_API_URL`:
   - **Value**: `https://she-wants-backend.onrender.com` (your Render URL)
5. Go to "Deployments"
6. Click "..." on latest deployment → "Redeploy"

---

## 🎯 Alternative: Netlify (If Vercel doesn't work)

### Deploy to Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
cd /Users/macbookair/Desktop/SHE_WANTS
netlify deploy --prod --dir=dist
```

**Follow prompts:**
- Create new site? **Yes**
- Team? **Your account**
- Site name? **she-wants**

**You'll get:** `https://she-wants.netlify.app`

---

## 📝 After Deployment Checklist

### Test Your Deployed App

1. **Open your frontend URL** (e.g., `https://she-wants.vercel.app`)
2. **Check calculator loads**
3. **Click "Next" button**
4. **Try logging in** with:
   - Username: `testuser`
   - Password: `password123`
5. **Test features:**
   - Period Tracker
   - Pad Request
   - Nearby Requests
   - Community Support
   - Sisterhood Chats

### Update Your README

Add your hosted links to README.md:

```markdown
### Hosted Project Link
- **Live App**: https://she-wants.vercel.app
- **Backend API**: https://she-wants-backend.onrender.com
```

---

## 🐛 Troubleshooting

### Frontend shows "Cannot connect to backend"

**Solution:**
1. Check if backend is deployed and running on Render
2. Verify `VITE_API_URL` environment variable in Vercel
3. Check browser console for errors
4. Verify CORS settings in server/index.js

### Backend deployment fails

**Solution:**
1. Check Render logs for errors
2. Verify `package.json` has all dependencies
3. Ensure `node server/index.js` works locally
4. Check Node.js version compatibility

### Database errors

**Solution:**
- Render automatically creates the SQLite database
- Check if `server/database.js` runs on startup
- Verify file permissions

---

## 💰 Cost

**Total Cost: $0 (100% FREE)**

- Vercel Free Tier: 100GB bandwidth/month
- Render Free Tier: 750 hours/month
- No credit card required for either!

---

## ⏱️ Deployment Time

- **Vercel (Frontend)**: ~3 minutes
- **Render (Backend)**: ~10 minutes
- **Total**: ~15 minutes

---

## 🎉 You're Done!

Once deployed, you'll have:
- ✅ Live frontend URL
- ✅ Live backend API
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Free hosting

**Share your link:** `https://she-wants.vercel.app`

---

## 📞 Need Help?

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboard
2. Test locally first: `npm run dev`
3. Verify all environment variables
4. Check CORS settings

---

## 🚀 Quick Commands Reference

```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Check if backend is running
curl https://she-wants-backend.onrender.com/api/helpers
```

---

**Ready to deploy?** Start with Vercel CLI - it's the fastest! 🎯
