# StyleForge3D - Complete Setup Instructions

## 📦 What's Included

This package contains a **complete full-stack application**:

- ✅ **Frontend** - HTML/CSS/JS with Three.js 3D customization
- ✅ **Backend** - Node.js/Express REST API
- ✅ **Database** - MongoDB schemas and sample data
- ✅ **Authentication** - JWT user authentication
- ✅ **Documentation** - Full API docs and guides

---

## 🚀 Installation Steps

### Step 1: Install Prerequisites

#### A. Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version (recommended)
3. Install with default settings
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### B. Install MongoDB

**Option 1: Local MongoDB (Recommended for Development)**
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install with default settings
4. MongoDB will run as a service

**Option 2: MongoDB Atlas (Cloud - Easier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (takes 5-10 minutes)
4. Get connection string
5. Update `.env` file with your connection string

#### C. Install VS Code
1. Go to https://code.visualstudio.com/
2. Download and install
3. Install "Live Server" extension:
   - Open VS Code
   - Click Extensions (Ctrl+Shift+X)
   - Search "Live Server"
   - Install by Ritwick Dey

---

### Step 2: Extract and Navigate

```bash
# Extract the zip file
unzip styleforge3d-fullstack.zip

# Navigate to project
cd styleforge3d-fullstack
```

---

### Step 3: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# This will install:
# - Express (web framework)
# - Mongoose (MongoDB ODM)
# - JWT (authentication)
# - and other dependencies
```

#### Configure Environment Variables

Open `backend/.env` file and update if needed:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
MONGODB_URI=mongodb://localhost:27017/styleforge3d
JWT_SECRET=your-super-secret-jwt-key
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/styleforge3d
```

#### Initialize Database with Sample Data

```bash
# Run database seeder
npm run init-db

# This creates 3 sample products:
# - Classic Cap ($24.99)
# - Urban Backpack ($49.99)
# - Essential T-Shirt ($19.99)
```

#### Start Backend Server

```bash
# Start server
npm start

# You should see:
# ✅ MongoDB Connected
# 🚀 Server running on: http://localhost:3000
```

**For development with auto-reload:**
```bash
npm run dev
```

Keep this terminal window open!

---

### Step 4: Setup Frontend

1. **Open new terminal window**

2. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

3. **Open in VS Code**
   ```bash
   code .
   ```

4. **Start Live Server**
   - In VS Code, right-click `index.html`
   - Click "Open with Live Server"
   - Browser opens automatically at http://localhost:5500

---

### Step 5: Test the Application

#### Test Backend API

Open browser and visit:
```
http://localhost:3000/api/products
```

You should see JSON with 3 products!

#### Test Frontend

1. **Landing Page** (http://localhost:5500)
   - Click "Start Customizing" button

2. **Shop Page**
   - See 3 products
   - Click "Customize Now" on any product

3. **3D Studio**
   - See 3D model (or fallback geometry)
   - Click and drag to rotate
   - Select different colors
   - Check stickers
   - Watch price update
   - Click "Add to Cart"

4. **Cart Page**
   - See your customized item
   - Click "Proceed to Checkout"

---

## 🎯 Quick Commands Reference

### Backend Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Initialize/reset database
npm run init-db
```

### Frontend

- Open `index.html` with Live Server in VS Code
- No build process needed!

---

## 📡 API Testing

### Using Browser
```
http://localhost:3000/api/products
http://localhost:3000/api/health
```

### Using curl
```bash
# Get all products
curl http://localhost:3000/api/products

# Get single product
curl http://localhost:3000/api/products/PRODUCT_ID

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "John Doe",
    "items": [...]
  }'
```

### Using Postman
1. Download Postman: https://www.postman.com/
2. Import API endpoints
3. Base URL: `http://localhost:3000/api`
4. Test all endpoints

---

## 🎨 Adding 3D Models

### Free 3D Model Resources

1. **Sketchfab** (Best option)
   - Go to: https://sketchfab.com/
   - Search: "baseball cap"
   - Filter: Downloadable, Free
   - Download format: GLB/GLTF 2.0

2. **CGTrader**
   - URL: https://www.cgtrader.com/free-3d-models
   - Search for products
   - Download GLB format

3. **TurboSquid**
   - URL: https://www.turbosquid.com/
   - Filter by free + GLB format

### How to Add Model

1. Download .glb file
2. Rename to `cap.glb` (or appropriate name)
3. Place in `frontend/models/cap.glb`
4. Refresh browser

**Note:** App works with fallback 3D geometry if no model is found!

---

## ⚠️ Common Issues & Solutions

### Issue: "npm: command not found"
**Solution:** Node.js not installed. Install from https://nodejs.org/

### Issue: "MongoDB connection failed"
**Solution:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- For Windows: `net start MongoDB`
- For Mac/Linux: `sudo systemctl start mongod`
- OR use MongoDB Atlas cloud URL

### Issue: "Port 3000 already in use"
**Solution:**
- Change PORT in backend/.env to another port (e.g., 5000)
- OR kill process using port 3000

### Issue: "CORS error" in browser console
**Solution:**
- Make sure backend is running
- Check FRONTEND_URL in backend/.env matches Live Server URL
- Default: `http://localhost:5500`

### Issue: Frontend can't connect to API
**Solution:**
- Verify backend is running on port 3000
- Check API_BASE_URL in frontend/js/api.js
- Should be: `http://localhost:3000/api`

### Issue: 3D model not showing
**Solution:**
- Download .glb model from Sketchfab
- Place in frontend/models/cap.glb
- Fallback geometry will show if no model

---

## 🔧 Configuration Files

### Backend `.env`
```env
PORT=3000                                    # Backend server port
NODE_ENV=development                         # Environment
FRONTEND_URL=http://localhost:5500          # Frontend URL for CORS
MONGODB_URI=mongodb://localhost:27017/...   # Database connection
JWT_SECRET=your-secret-key                  # JWT secret for auth
JWT_EXPIRE=7d                               # Token expiration
```

### Frontend API Configuration
File: `frontend/js/api.js`
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

---

## 📊 Database Structure

### Collections Created:

1. **products** - Product catalog
2. **orders** - Customer orders
3. **users** - User accounts

### Sample Product Structure:
```javascript
{
  name: "Classic Cap",
  basePrice: 24.99,
  category: "cap",
  availableColors: [...],
  availableStickers: [...],
  stock: 150,
  featured: true
}
```

---

## 🚀 Next Steps

### Development
1. ✅ Backend running on port 3000
2. ✅ Frontend running on port 5500
3. ✅ Database initialized with sample data
4. ✅ Start customizing and building!

### Customization
- Add more products: Edit `backend/scripts/initDatabase.js`
- Change colors: Edit `frontend/studio.html`
- Update styles: Edit `frontend/css/style.css`
- Add API endpoints: Create routes in `backend/routes/`

### Deployment
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Heroku, Railway, Render
- See README.md for deployment guides

---

## 📚 Additional Resources

- **Full Documentation**: README.md
- **Quick Start**: QUICKSTART.txt
- **API Reference**: See API Endpoints section in README
- **Code Comments**: All files have detailed comments

---

## 🎉 You're All Set!

Your StyleForge3D application is ready to use!

**Running the App:**
1. Terminal 1: `cd backend && npm start`
2. Terminal 2: Open `frontend/index.html` with Live Server
3. Browse to http://localhost:5500

**Happy Coding! 🚀**
