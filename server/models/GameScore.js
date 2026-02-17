const mongoose = require('mongoose');

const GameScoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameType: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        default: 'General'
    },
    maxScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GameScore', GameScoreSchema);
