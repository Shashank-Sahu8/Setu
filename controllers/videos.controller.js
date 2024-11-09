const Video = require('../models/videos');

exports.addMultipleVideos = async (req, res) => {
  const videos = req.body.videos;  

  if (!Array.isArray(videos) || videos.length === 0) {
    return res.status(400).json({ message: 'Please provide an array of video details.' });
  }

  for (let video of videos) {
    const { id, thumbnail_url, title, video_url, duration, difficulty } = video;

    if (!id || !thumbnail_url || !title || !video_url || !duration || !difficulty) {
      return res.status(400).json({ message: 'All fields are required for each video.' });
    }

    if (!['beginner', 'intermediate', 'expert'].includes(difficulty)) {
      return res.status(400).json({ message: `Invalid difficulty level in video ${title}` });
    }
  }

  try {
    const newVideos = await Video.insertMany(videos);
    res.status(201).json({ message: 'Videos added successfully', videos: newVideos });
  } catch (error) {
    res.status(500).json({ message: 'Error adding videos', error });
  }
};



exports.getVideosByDifficulty = async (req, res) => {
    const { difficulty } = req.params;
  
    if (!['beginner', 'intermediate', 'expert'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }
  
    try {
      const videos = await Video.find({ difficulty });
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching videos', error });
    }
  };
  