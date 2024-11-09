const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  id: 
  { 
    type: String, 
    required: true, 
    unique: true 
  }, 
  thumbnail_url: 
  { 
    type: String, 
    required: true 
  },     
  title: 
  { 
    type: String, 
    required: true 
  },         
  video_url: 
  { 
    type: String, 
    required: true 
  },     
  duration: 
  { 
    type: String, 
    required: true 
  },          
  difficulty: 
  { 
    type: String, 
    enum: ['beginner', 'intermediate', 'expert'], 
    required: true 
  }                                                    // Difficulty level
});

module.exports = mongoose.model('Video', videoSchema);
