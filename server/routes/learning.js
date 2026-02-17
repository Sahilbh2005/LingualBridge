const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCourses, updateProgress, enrollCourse, getCourseById } = require('../controllers/learningController');

router.get('/courses', auth, getCourses);
router.get('/courses/:courseId', auth, getCourseById);
router.post('/enroll/:courseId', auth, enrollCourse);
router.post('/progress', auth, updateProgress);

// Duolingo-style Lesson Routes
router.post('/generate-lesson', auth, (req, res, next) => {
    // Placeholder for AI generation logic
    require('../controllers/learningController').generateLesson(req, res);
});
router.get('/lessons/:id', auth, (req, res, next) => {
    require('../controllers/learningController').getLessonById(req, res);
});
router.post('/submit-answer', auth, (req, res, next) => {
    require('../controllers/learningController').submitAnswer(req, res);
});

module.exports = router;
