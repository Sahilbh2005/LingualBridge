const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { translateText, getTranslationHistory } = require('../controllers/translateController');

router.post('/', auth, translateText);
router.get('/history', auth, getTranslationHistory);

module.exports = router;
