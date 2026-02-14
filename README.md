# StyleForge3D - Full Stack 3D Product Customization Platform

A complete e-commerce platform with 3D product customization featuring a modern frontend and robust Node.js backend.

## 🚀 Project Overview

StyleForge3D is a full-stack application that allows users to customize products in real-time 3D, select colors, add stickers, and place orders.

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Three.js for 3D rendering
- OrbitControls for 3D interaction
- LocalStorage for cart persistence

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture
- CORS enabled for frontend communication

## 📁 Project Structure

```
styleforge3d-fullstack/
│
├── frontend/                  # Client-side application
│   ├── index.html            # Landing page
│   ├── shop.html             # Product catalog
│   ├── studio.html           # 3D customizer
│   ├── cart.html             # Shopping cart
│   ├── css/
│   │   └── style.css         # All styles
│   ├── js/
│   │   ├── app.js            # Main utilities
│   │   ├── cart.js           # Cart functionality
│   │   └── api.js            # API integration (NEW)
│   └── models/
│       └── cap.glb           # 3D models
│
├── backend/                   # Server-side application
│   ├── server.js             # Main server file
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables
│   ├── models/               # Database schemas
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/               # API endpoints
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── users.js
│   └── scripts/
│       └── initDatabase.js   # Database seeder
│
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/

2. **MongoDB** (v4.4 or higher)
   - Download: https://www.mongodb.com/try/download/community
   - OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **VS Code** with Live Server extension
   - Download VS Code: https://code.visualstudio.com/
   - Install Live Server extension

### Step 1: Extract Project

```bash
# Extract the zip file
unzip styleforge3d-fullstack.zip
cd styleforge3d-fullstack
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings
# (MongoDB URI, JWT secret, etc.)

# Initialize database with sample products
npm run init-db

# Start the backend server
npm start
# OR for development with auto-reload:
npm run dev
```

The backend will start on: **http://localhost:3000**

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder
cd ../frontend

# Open in VS Code
code .

# Right-click index.html and select "Open with Live Server"
```

The frontend will open on: **http://localhost:5500**

### Step 4: Add 3D Model (Optional)

1. Download a free .glb model from:
   - **Sketchfab**: https://sketchfab.com/3d-models/
   - Search for "baseball cap glb"
   - Download in GLB format

2. Rename to `cap.glb`

3. Place in `frontend/models/cap.glb`

**Note:** The app includes fallback 3D geometry, so it works without a model file!

## 🎯 How to Use

### 1. Start Backend Server

```bash
cd backend
npm start
```

Server runs on **http://localhost:3000**

### 2. Start Frontend

Open `frontend/index.html` with Live Server in VS Code

### 3. Test the Application

1. **Landing Page** → Click "Start Customizing"
2. **Shop Page** → Browse products, click "Customize Now"
3. **3D Studio** → 
   - Rotate model with mouse
   - Select colors
   - Add stickers
   - Click "Add to Cart"
4. **Cart Page** → View items, proceed to checkout

## 📡 API Endpoints

### Products

```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product (Admin)
PUT    /api/products/:id       # Update product (Admin)
DELETE /api/products/:id       # Delete product (Admin)
```

### Cart

```
GET    /api/cart/:sessionId           # Get cart items
POST   /api/cart/:sessionId           # Add to cart
DELETE /api/cart/:sessionId/:itemId   # Remove from cart
DELETE /api/cart/:sessionId           # Clear cart
```

### Orders

```
POST   /api/orders                    # Create order
GET    /api/orders/:orderNumber       # Get order by number
GET    /api/orders/email/:email       # Get orders by email
PUT    /api/orders/:orderNumber/status # Update order status
```

### Users

```
POST   /api/users/register            # Register new user
POST   /api/users/login               # Login user
GET    /api/users/profile/:userId     # Get user profile
```

## 🧪 Testing the API

### Using curl:

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

### Using Postman:

1. Import the API endpoints
2. Set base URL: `http://localhost:3000/api`
3. Test each endpoint

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
MONGODB_URI=mongodb://localhost:27017/styleforge3d
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### Database Connection

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/styleforge3d
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/styleforge3d
```

## 📦 Database Schema

### Product Schema
```javascript
{
  name: String,
  description: String,
  basePrice: Number,
  category: String,
  availableColors: [{ name, hex }],
  availableStickers: [{ name, icon, price }],
  stock: Number,
  featured: Boolean
}
```

### Order Schema
```javascript
{
  orderNumber: String,
  customerEmail: String,
  customerName: String,
  items: [OrderItem],
  subtotal: Number,
  total: Number,
  status: String,
  paymentStatus: String
}
```

## 🐛 Troubleshooting

### Backend Issues

**Problem:** MongoDB connection failed
```bash
# Solution: Make sure MongoDB is running
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
```

**Problem:** Port 3000 already in use
```bash
# Solution: Change PORT in .env file
PORT=5000
```

### Frontend Issues

**Problem:** CORS errors
```bash
# Solution: Check FRONTEND_URL in backend .env matches your Live Server URL
FRONTEND_URL=http://localhost:5500
```

**Problem:** API not responding
```bash
# Solution: Make sure backend server is running
cd backend
npm start
```

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. **Push code to GitHub**
2. **Connect repository to hosting platform**
3. **Set environment variables**
4. **Deploy**

### Frontend Deployment (Netlify, Vercel, GitHub Pages)

1. **Build frontend** (no build step needed - static files)
2. **Upload to hosting platform**
3. **Update API URL** in frontend to production backend URL

## 📝 Development Workflow

### Adding New Products

```bash
# Edit backend/scripts/initDatabase.js
# Add new product object to sampleProducts array
# Run:
cd backend
npm run init-db
```

### Adding New API Endpoints

1. Create route in `backend/routes/`
2. Import in `backend/server.js`
3. Add route: `app.use('/api/endpoint', routeName)`

### Customizing Frontend

- **Colors**: Edit `frontend/studio.html` color picker
- **Stickers**: Edit `frontend/studio.html` sticker grid
- **Products**: Edit `frontend/shop.html` product cards
- **Styles**: Edit `frontend/css/style.css`

## 🎨 Features

✅ Real-time 3D product visualization  
✅ Dynamic color selection  
✅ Sticker customization  
✅ Live price calculation  
✅ Shopping cart with localStorage  
✅ RESTful API backend  
✅ MongoDB database integration  
✅ User authentication (JWT)  
✅ Order management  
✅ Responsive design  

## 🔐 Security

- JWT authentication for protected routes
- Password hashing with bcrypt
- Helmet.js for security headers
- Input validation with express-validator
- CORS configuration
- Environment variables for secrets

## 📊 Performance

- Compression middleware
- MongoDB indexing
- Efficient 3D model loading
- LocalStorage for cart caching
- Minimal dependencies

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Happy Coding!

Build amazing 3D customization experiences with StyleForge3D!

---

**Need Help?**
- Check the troubleshooting section
- Review API documentation
- Inspect browser console for errors
- Check backend logs

**Created with ❤️ for learning and innovation**
