// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const User = require('../models/users');        // User schema
const Question = require('../models/questions'); // Question schema

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---

// 1️⃣ Login or Register (No Encryption)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ username: email });

    if (!user) {
      // Register new user (store password as plain text)
      user = new User({ username: email, password, attempts: [] });
      await user.save();
    } else {
      // Compare plain text password
      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Incorrect password' });
      }
    }

    res.json({ success: true, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2️⃣ Get 10 Random Questions for a Topic
app.get('/api/questions/:topic', async (req, res) => {
  const topic = req.params.topic;

  try {
    const questions = await Question.aggregate([
      { $match: { topic } },
      { $sample: { size: 10 } }
    ]);

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ questions: [] });
  }
});

// 3️⃣ Get User Attempts
app.get('/api/attempts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      latestScore: user.attempts.length > 0
        ? user.attempts[user.attempts.length - 1].score
        : 0,
      attempts: user.attempts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4️⃣ Save Quiz Result
app.post('/api/saveResult', async (req, res) => {
  const { userId, topic, score, total } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const attemptNo = user.attempts.length + 1;
    user.attempts.push({ attemptNo, topic, score, total, date: new Date() });
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 5️⃣ Get User History
app.get('/api/history/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('attempts');
    if (!user) return res.status(404).json({ attempts: [] });

    res.json({ attempts: user.attempts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ attempts: [] });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
