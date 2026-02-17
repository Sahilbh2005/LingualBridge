const GameScore = require('../models/GameScore');

// @desc    Save game score
// @route   POST /api/games/score
// @access  Private
exports.saveScore = async (req, res) => {
    const { gameType, score, language } = req.body;

    try {
        const newScore = new GameScore({
            user: req.user.id,
            gameType,
            score,
            language
        });

        const savedScore = await newScore.save();
        res.json(savedScore);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get leaderboard for a game
// @route   GET /api/games/leaderboard/:gameType
// @access  Private
exports.getLeaderboard = async (req, res) => {
    try {
        const scores = await GameScore.find({ gameType: req.params.gameType })
            .sort({ score: -1 })
            .limit(10)
            .populate('user', 'username');
        res.json(scores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
