const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  // Store password directly (no hashing)
  const user = new User({ email, password });
  await user.save();

  req.session.userId = user._id;
  req.session.email = user.email;
  res.json({ success: true });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  // Direct password comparison (since no hashing)
  if (user.password !== password) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user._id;
  req.session.email = user.email;
  res.json({ success: true });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

module.exports = router;
