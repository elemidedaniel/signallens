const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { fullName, email, password, nationality, phoneNumber, profilePhoto } = req.body;

  // Validate required fields
  if (!fullName || !email || !password || !nationality || !phoneNumber) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  try {
    const user = await User.create({
      fullName,
      email,
      password,
      nationality,
      phoneNumber,
      profilePhoto: profilePhoto || '',
    });

    res.status(201).json({
      _id: user._id,
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      nationality: user.nationality,
      phoneNumber: user.phoneNumber,
      profilePhoto: user.profilePhoto,
      watchlist: user.watchlist,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        nationality: user.nationality,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
        watchlist: user.watchlist,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = { register, login };