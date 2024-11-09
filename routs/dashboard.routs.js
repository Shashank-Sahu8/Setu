const express = require('express');
const dashboard_router = express.Router();
const ScoreController = require('../controllers/dashboard.controller');
const verifyToken = require('../middleware/verifyToken');  


dashboard_router.get('/dashboard', verifyToken, ScoreController.getUserScores);

module.exports = dashboard_router;
