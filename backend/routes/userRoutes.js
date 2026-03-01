const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controllers/userController');

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Watchlist routes
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:coinId', protect, removeFromWatchlist);

module.exports = router;