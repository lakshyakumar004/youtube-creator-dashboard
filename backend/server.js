require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session'); // ✅ Import session
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const videoRoutes = require('./routes/videoRoutes');

connectDB();

const app = express();

// ✅ Session middleware (must come before routes)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use env var in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true                // allow cookies/session
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/videos', videoRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Optional: Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
