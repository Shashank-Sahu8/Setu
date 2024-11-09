const Question = require('../models/questions.js');
const Score=require("../models/quiz_score.js");
const User = require('../models/user.model');

exports.getQuestions = async (req, res) => {
    const { difficulty } = req.params;
  
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }

  try {
    const questions = await Question.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 10 } } 
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};


exports.submitScore = async (req, res) => {
    
  const { score, difficulty } = req.body;
  const userId = req.user.id;

  if (!score || !['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ message: 'Invalid data provided' });
  }

  try {
    const userScore = new Score({
      userId,
      score,
      difficulty
    });

    await userScore.save();
    res.json({ message: 'Score submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting score', error });
  }
};


exports.addQuestion = async (req, res) => {
    const {text, options, correctAnswerIndex, difficulty } = req.body;
  
    if (!text || !Array.isArray(options) || options.length != 4 || correctAnswerIndex === undefined || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid data provided. Make sure all fields are correct.' });
    }
  
    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({ message: 'Correct answer index is out of range.' });
    }
  
    for (const option of options) {
      if (!option.text && !option.imageUrl) {
        return res.status(400).json({ message: 'Each option must have at least a text or an image URL.' });
      }
    }
  
    try {
      const newQuestion = new Question({
        text,
        options,
        correctAnswerIndex,
        difficulty
      });
  
      await newQuestion.save();
  
      res.status(201).json({ message: 'Question added successfully', question: newQuestion });
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Error adding question', error });
    }
  };