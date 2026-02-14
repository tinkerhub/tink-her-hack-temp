// ========================================
// StyleForge3D Backend Server
// Main Entry Point
// ========================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();

// ========================================
// Middleware Configuration
// ========================================

// Security headers
app.use(helmet());

// Enable CORS for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true
}));

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Static files (for uploaded images, etc.)
app.use('/uploads', express.static('uploads'));

// ========================================
// Database Connection
// ========================================

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/styleforge3d', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // For development, continue without database
        console.log('⚠️  Running without database (development mode)');
    }
};

// Connect to database
connectDB();

// ========================================
// API Routes
// ========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'StyleForge3D API is running',
        timestamp: new Date().toISOString()
    });
});

// Main API routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to StyleForge3D API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            products: '/api/products',
            cart: '/api/cart',
            orders: '/api/orders',
            users: '/api/users'
        }
    });
});

// ========================================
// Error Handling Middleware
// ========================================

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ========================================
// Start Server
// ========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║         StyleForge3D Backend Server Started           ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log('');
    console.log('Available Endpoints:');
    console.log(`   GET  /api/health           - Health check`);
    console.log(`   GET  /api/products         - Get all products`);
    console.log(`   POST /api/cart             - Add to cart`);
    console.log(`   POST /api/orders           - Create order`);
    console.log(`   POST /api/users/register   - Register user`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');
});

module.exports = app;
