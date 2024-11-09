const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: 
  { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  score: 
  { 
    type: Number, 
    required: true 
  },
  difficulty: 
  { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  },
  date: 
  { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Score', scoreSchema);
