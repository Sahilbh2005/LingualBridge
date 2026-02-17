const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { saveScore, getLeaderboard } = require('../controllers/gamesController');

router.post('/score', auth, saveScore);
router.get('/leaderboard/:gameType', auth, getLeaderboard);

module.exports = router;
