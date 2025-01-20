const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const dotenv = require('dotenv');
require('../config/passportConfig')
dotenv.config();

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password, name });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
router.get(
  '/callback/google',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.status(200).json({ token, user });
  }
);

// GitHub Login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Callback
router.get(
  '/callback/github',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.status(200).json({ token, user });
  }
);

module.exports = router;
