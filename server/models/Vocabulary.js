const mongoose = require('mongoose');

const VocabularySchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        index: true // Efficient lookup
    },
    category: {
        type: String,
        required: true,
        index: true // e.g., 'vegetables', 'greetings'
    },
    word: {
        type: String,
        required: true
    },
    nativeFigure: String,
    icon: String, // For shapes, fruits, etc.
    transliteration: String,
    meaning: String,
    pronunciation: String,
    example: {
        native: String,
        transliteration: String,
        english: String
    },
    imagePrompt: String,
    ttsText: String,
    order: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Vocabulary', VocabularySchema);
