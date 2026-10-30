
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables
dotenv.config({
    path: path.join(__dirname, '.env')
});

// Route files
const auth = require('./routes/auth');
const colleges = require('./routes/colleges');
const reviews = require('./routes/reviews');
const admin = require('./routes/admin');

// Database connection
const connectDB = require('./config/database');

// Error handler
const errorHandler = require('./utils/errorHandler');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    }
});

// Apply rate limiting
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
    extended: false,
    limit: '10mb'
}));

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false
}));

// CORS middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? true
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173'
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ---------------- API ROUTES ----------------

app.use('/api/auth', auth);
app.use('/api/colleges', colleges);
app.use('/api/reviews', reviews);
app.use('/api/admin', admin);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// ---------------- FRONTEND HOSTING ----------------

// Create React App uses "build"
// Vite uses "dist"
const frontendPath = path.join(
    __dirname,
    '../frontend/build'
);

// Serve frontend static files
app.use(express.static(frontendPath));

// Serve React application
app.get('*', (req, res, next) => {

    // Unknown API routes should return JSON 404
    if (req.path.startsWith('/api/')) {
        return next();
    }

    res.sendFile(
        path.join(frontendPath, 'index.html'),
        (err) => {
            if (err) {
                next(err);
            }
        }
    );
});

// ---------------- 404 HANDLER ----------------

app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// ---------------- ERROR HANDLER ----------------

app.use(errorHandler);

// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);

    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

module.exports = app;
