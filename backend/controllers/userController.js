const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile (phone, photo)
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { phoneNumber, profilePhoto } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      userId: updatedUser.userId,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      nationality: updatedUser.nationality,
      phoneNumber: updatedUser.phoneNumber,
      profilePhoto: updatedUser.profilePhoto,
      watchlist: updatedUser.watchlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add coin to watchlist
// @route   POST /api/user/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { coinId, symbol, name, image } = req.body;
    if (!coinId || !symbol || !name) {
      return res.status(400).json({ message: 'coinId, symbol, and name are required' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if coin already exists in watchlist
    const alreadyExists = user.watchlist.some((item) => item.coinId === coinId);
    if (alreadyExists) {
      return res.status(400).json({ message: 'Coin already in watchlist' });
    }

    user.watchlist.push({ coinId, symbol, name, image: image || '' });
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove coin from watchlist
// @route   DELETE /api/user/watchlist/:coinId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchlist = user.watchlist.filter((item) => item.coinId !== req.params.coinId);
    await user.save();
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, updateProfile, addToWatchlist, removeFromWatchlist };