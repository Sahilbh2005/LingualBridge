const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    nativeLanguage: {
        type: String,
        default: 'English'
    },
    // Legacy support (to be deprecated or mapped)
    learningLanguages: [{
        language: String,
        level: { type: String, default: 'Beginner' },
        progress: { type: Number, default: 0 }
    }],
    // New Enrollment System
    enrolledCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        progress: {
            type: Number,
            default: 0
        },
        completedChapters: [{
            type: String
        }],
        dateEnrolled: {
            type: Date,
            default: Date.now
        },
        chapterProgress: [{
            chapterId: String,
            score: Number,
            stars: Number,
            accuracy: Number,
            date: { type: Date, default: Date.now }
        }]
    }],
    // Gamification
    totalXP: {
        type: Number,
        default: 0
    },
    streak: {
        count: { type: Number, default: 0 },
        lastActivity: { type: Date }
    },
    achievements: [{
        id: String,
        name: String,
        date: { type: Date, default: Date.now }
    }],
    lessonHistory: [{
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        score: Number,
        totalQuestions: Number,
        accuracy: Number,
        date: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
