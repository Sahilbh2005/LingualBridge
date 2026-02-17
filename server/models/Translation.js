const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sourceText: {
        type: String,
        required: true
    },
    translatedText: {
        type: String,
        required: true
    },
    sourceLang: {
        type: String,
        default: 'Automatic'
    },
    targetLang: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Translation', TranslationSchema);
