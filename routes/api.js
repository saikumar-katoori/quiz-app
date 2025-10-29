const express = require('express');
const Question = require('../models/question');
const User = require('../models/user');
const router = express.Router();

// ---------------- GET 10 RANDOM QUESTIONS ----------------
router.get('/questions/:topic', async (req, res) => {
  try {
    const topic = req.params.topic;

    // Fetch 10 random questions from MongoDB
    const questions = await Question.aggregate([
      { $match: { topic } },
      { $sample: { size: 10 } } // random 10
    ]);

    res.json({ questions });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// ---------------- SUBMIT QUIZ RESULTS ----------------
router.post('/submit', async (req, res) => {
  try {
    const { topic, score, total } = req.body;
    const userId = req.session.userId; // or from JWT/localStorage

    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const attemptNo = user.attempts.length + 1;
    user.attempts.push({ attemptNo, topic, score, total });
    await user.save();

    res.json({ success: true, attemptNo });
  } catch (err) {
    console.error('Error saving attempt:', err);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

// ---------------- VIEW PREVIOUS ATTEMPTS ----------------
router.get('/attempts', async (req, res) => {
  try {
    const userId = req.session.userId; // or from JWT/localStorage
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findById(userId).select('attempts');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ attempts: user.attempts });
  } catch (err) {
    console.error('Error fetching attempts:', err);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

module.exports = router;
