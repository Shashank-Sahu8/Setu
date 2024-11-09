const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: 
  { 
    type: String, 
    required: true 
  },
  options: [
    {
      text: String,     
      imageUrl: String,  
    }
  ],
  correctAnswerIndex: 
  { 
    type: Number, 
    required: true 
  }, 
  difficulty: 
  { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true 
  }
});

module.exports = mongoose.model('Question', questionSchema);
