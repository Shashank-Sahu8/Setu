const QuizController = require("../controllers/quiz.controller")
const express = require('express');
const quiz_router = express.Router();
const verifyToken = require('../middleware/verifyToken');

quiz_router.get('/questions/:difficulty',verifyToken, QuizController.getQuestions);

quiz_router.post('/submit-score', verifyToken, QuizController.submitScore);

quiz_router.post('/add-question', verifyToken, QuizController.addQuestion);

module.exports=quiz_router;