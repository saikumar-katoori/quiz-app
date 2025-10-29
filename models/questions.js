const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic: String,
  questionText: String,
  options: [String],
  correctIndex: Number
});

module.exports = mongoose.model('question', questionSchema);
