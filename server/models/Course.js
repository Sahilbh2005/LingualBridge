const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    level: {
        type: String, // Beginner, Intermediate, Advanced
        required: true
    },
    description: String,
    sections: [{
        title: {
            type: String,
            required: true // Beginner, Intermediate, Advanced
        },
        chapters: [{
            chapterId: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            lessons: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson'
            }],
            order: Number
        }]
    }],
    orderIndex: {
        type: Number,
        default: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', CourseSchema);
