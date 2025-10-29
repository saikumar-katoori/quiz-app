const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  attemptNo: Number,
  topic: String,
  score: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  attempts: [attemptSchema]
});



module.exports = mongoose.model('user', userSchema);
