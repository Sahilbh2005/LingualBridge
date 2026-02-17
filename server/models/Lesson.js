const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    chapterId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    vocabulary: [{
        wordNative: String,
        nativeFigure: String,
        transliteration: String,
        englishMeaning: String,
        pronunciation: String,
        word: String, // Keep legacy fields for compatibility during transition
        meaning: String,
        pronunciationHint: String,
        example: {
            native: String,
            transliteration: String,
            english: String
        },
        imagePrompt: String,
        imageUrl: String,
        sentenceImagePrompt: String,
        sentenceImageUrl: String,
        ttsScript: String
    }],
    grammar: {
        title: String,
        explanation: String
    },
    phonetics: [{
        title: String,
        description: String,
        tip: String,
        imagePrompt: String,
        example: String,
        tips: [String],
        examples: [{ letter: String, explanation: String }]
    }],
    exampleSentences: [{
        target: String,
        translation: String,
        transliteration: String,
        imagePrompt: String,
        imageUrl: String,
        sentenceImageUrl: String
    }],
    exercises: [{
        type: {
            type: String,
            enum: [
                'multiple-choice',
                'fill-in-blanks',
                'match-pair',
                'rearrange',
                'listening',
                'speaking'
            ],
            required: true
        },
        question: String,
        options: [String], // For multiple-choice, fill-in-blanks, listening
        words: [String], // Source bank for rearrange exercises
        correctAnswer: mongoose.Schema.Types.Mixed, // String or Array for rearrange
        pairs: [{ left: String, right: String }], // For match-pair
        audioText: String, // For listening/speaking
        imageUrl: String, // Pictogram for the exercise question
        nativeFigure: String,
        nativeWord: String
    }],
    aiGenerated: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lesson', LessonSchema);
