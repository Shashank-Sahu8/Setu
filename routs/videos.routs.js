const express = require('express');
const video_router = express.Router();
const VideoController = require('../controllers/videos.controller');
const verifyToken = require('../middleware/verifyToken');

video_router.post('/add-video', verifyToken, VideoController.addMultipleVideos);

video_router.get('/get-videos/:difficulty', VideoController.getVideosByDifficulty);

module.exports = video_router;
