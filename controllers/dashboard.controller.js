const Score = require('../models/quiz_score');

exports.getUserScores = async (req, res) => {
  try {
    const userId = req.user.id;

    const scores = await Score.find({ userId })
      .sort({ date: -1 })  
      .select('score difficulty date');  

      let totalScore=0;

     for(let sc of scores)
     {
        console.log(sc.score);
        totalScore+=sc.score;
     }
  
    res.json({
      message: 'User scores retrieved successfully',
      scores,
      totalScore
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving scores', error });
  }
};
