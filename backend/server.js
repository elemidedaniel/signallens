const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const coinRoutes = require('./routes/coinRoutes');
const alertRoutes = require('./routes/alertRoutes');
const { startPriceChecker } = require('./services/priceChecker');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/coins', coinRoutes);
app.use('/api/alerts', alertRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: '🚀 SignalLens API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startPriceChecker();
});