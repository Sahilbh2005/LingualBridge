const Course = require('../models/Course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');
const curriculumData = require('../data/curriculumData');
const imageService = require('../services/imageService');

// @desc    Generate a dynamic lesson via AI
// @route   POST /api/learning/generate-lesson
exports.generateLesson = async (req, res) => {
    const { language, level, chapterTitle, chapterId } = req.body;
    try {
        if (!chapterId) return res.status(400).json({ msg: 'chapterId is required' });

        // Delete existing lesson for this chapter to force refresh with new logic
        await Lesson.deleteMany({ chapterId });
        const parts = chapterId.split('_');
        const themeId = parts.length > 1 ? parts.slice(parts.length - 1).join('_') : 'greetings';

        console.log(`DEBUG: Generating Lesson - Language Requested: "${language}", Theme Derived: "${themeId}", ChapterId: "${chapterId}"`);

        // Ultra-robust case-insensitive lookup for language
        const lookupLang = (langName) => {
            if (!langName) return null;
            const keys = Object.keys(curriculumData.contentMap);
            // Try exact match
            if (curriculumData.contentMap[langName]) return curriculumData.contentMap[langName];
            // Try case-insensitive
            const ciKey = keys.find(k => k.toLowerCase() === langName.toLowerCase());
            if (ciKey) return curriculumData.contentMap[ciKey];
            // Try prefix/contains match (Marathi Mastery matches Marathi)
            const looseKey = keys.find(k => langName.includes(k) || k.includes(langName));
            if (looseKey) return curriculumData.contentMap[looseKey];
            return null;
        };

        const langData = lookupLang(language) || {};
        let themeContent = langData[themeId] || {};

        // SPECIAL CASE: Dynamically generate Barakhadi if not explicitly defined
        if (themeId === 'barakhadi' && (!themeContent.vocabulary || themeContent.vocabulary.length === 0)) {
            const alphabetData = langData['alphabet'] || {};
            const consonants = (alphabetData.vocabulary || [])
                .filter(v => v.meaning && v.meaning.toLowerCase().includes('consonant'))
                .map(v => v.word);

            const matras = (curriculumData.matras && curriculumData.matras[language]) ? curriculumData.matras[language] : (curriculumData.matras['Marathi'] || []);

            if (consonants.length > 0) {
                const barakhadiVocab = [];
                // Pick 5 random consonants to keep the lesson manageable
                const selectedConsonants = consonants.sort(() => 0.5 - Math.random()).slice(0, 5);

                selectedConsonants.forEach(c => {
                    matras.forEach(m => {
                        barakhadiVocab.push({
                            word: c + m.symbol,
                            transliteration: (c === 'क' ? 'k' : (c === 'ख' ? 'kh' : (c === 'ग' ? 'g' : ''))) + m.transliteration, // Simple fallback transliteration logic
                            meaning: `Combination: ${c} + ${m.vowel}`,
                            pronunciation: `Sound of ${c}${m.symbol}`,
                            imagePrompt: `Writing ${c}${m.symbol}`
                        });
                    });
                });
                themeContent = { vocabulary: barakhadiVocab };
            }
        }

        const phonetics = themeContent.phonetics || [];

        if (!themeContent.vocabulary || themeContent.vocabulary.length === 0) {
            console.log(`WARNING: No vocabulary found for "${language}"/"${themeId}". Available themes for this language:`, Object.keys(langData));
        }

        // Fallback vocabulary with multiple items to ensure distractors exist
        const fallbackVocab = [
            {
                word: language.includes('Marathi') ? 'नमस्कार' : (language.includes('Hindi') ? 'नमस्ते' : 'Hello'),
                meaning: 'Hello',
                transliteration: language.includes('Marathi') ? 'Namaskar' : (language.includes('Hindi') ? 'Namaste' : 'Hello'),
                pronunciationHint: 'Greeting',
                imagePrompt: `Greeting in ${language}`,
                example: { native: language.includes('Marathi') ? 'नमस्कार!' : 'Hello!', english: 'Hello!' }
            },
            {
                word: language.includes('Marathi') ? 'धन्यवाद' : (language.includes('Hindi') ? 'धन्यवाद' : 'Thank you'),
                meaning: 'Thank you',
                transliteration: 'Dhanyavad',
                pronunciationHint: 'Gratitude',
                imagePrompt: `Thank you in ${language}`,
                example: { native: language.includes('Marathi') ? 'धन्यवाद!' : 'Thanks!', english: 'Thanks!' }
            }
        ];

        const vocabulary = (themeContent.vocabulary && themeContent.vocabulary.length > 0) ? themeContent.vocabulary : fallbackVocab;
        console.log(`DEBUG: Using vocabulary with ${vocabulary.length} items for ${language}`);

        // Shuffle vocabulary to get different words/letters in exercises each time
        const shuffledVocab = [...vocabulary].sort(() => 0.5 - Math.random());

        // SMART EXERCISE GENERATION
        const exercises = [];

        // Special handling for numbers to avoid showing both figure and word together
        if (themeId === 'numbers') {
            shuffledVocab.forEach((v, idx) => {
                if (idx < 10) {
                    const isFigureToWord = Math.random() > 0.5;
                    const vWord = String(v.word || "").trim();
                    const vFigure = String(v.nativeFigure || "").trim();
                    const vMeaning = String(v.meaning || "").trim();

                    if (isFigureToWord) {
                        // CHALLENGE: Figure -> Identify Word
                        const distractors = vocabulary
                            .filter(item => String(item.word || "").trim() !== vWord)
                            .map(item => String(item.word || "").trim())
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 3);

                        exercises.push({
                            type: 'multiple-choice',
                            question: `Identify the word for this number:`,
                            options: [vWord, ...distractors].sort(() => 0.5 - Math.random()),
                            correctAnswer: vWord,
                            nativeFigure: vFigure, // Show ONLY figure
                            targetBox: 'figure'
                        });
                    } else {
                        // CHALLENGE: Word -> Identify Figure
                        const distractors = vocabulary
                            .filter(item => String(item.nativeFigure || "").trim() !== vFigure)
                            .map(item => String(item.nativeFigure || "").trim())
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 3);

                        exercises.push({
                            type: 'multiple-choice',
                            question: `Identify the figure for "${vWord}":`,
                            options: [vFigure, ...distractors].sort(() => 0.5 - Math.random()),
                            correctAnswer: vFigure,
                            nativeWord: vWord, // Show ONLY word
                            targetBox: 'word'
                        });
                    }

                    // Add some "Write in Figures" or "Write in Words"
                    if (idx % 3 === 0) {
                        const isWriteWords = Math.random() > 0.5;
                        exercises.push({
                            type: 'fill-in-blanks',
                            question: isWriteWords ? `Write the word for "${vFigure}":` : `Write the figure for "${vWord}":`,
                            correctAnswer: isWriteWords ? vWord : vFigure,
                            nativeFigure: isWriteWords ? vFigure : null,
                            nativeWord: isWriteWords ? null : vWord,
                            targetBox: isWriteWords ? 'figure' : 'word'
                        });
                    }
                }
            });
        } else {
            // 1. Multiple Choice (Vocabulary)
            // 1. Multiple Choice (Vocabulary)
            const mcCount = Math.min(8, shuffledVocab.length);
            shuffledVocab.forEach((v, idx) => {
                if (idx < mcCount) {
                    const vWord = String(v.word || "").trim();
                    const vMeaning = String(v.meaning || "").trim();

                    // Randomized Direction: 0 = English -> Native (Hide Answer), 1 = Native -> English (Show Native)
                    const direction = Math.random() > 0.5 ? 0 : 1;

                    const distractors = vocabulary
                        .filter(item => String(item.word || "").trim() !== vWord)
                        .map(item => direction === 0 ? String(item.word || "").trim() : String(item.meaning || "").trim())
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 3);

                    if (direction === 0) {
                        // English -> Native (Question: Meaning, Answer: Native Word)
                        // CRITICAL: Do NOT send nativeWord/nativeFigure to prevent banner reveal
                        exercises.push({
                            type: 'multiple-choice',
                            question: `How do you say '${vMeaning}' in ${language}?`,
                            options: [vWord, ...distractors].sort(() => 0.5 - Math.random()),
                            correctAnswer: vWord,
                            imageUrl: imageService.generateImageUrl(v.imagePrompt || vMeaning),
                            // nativeWord is OMITTED intentionally
                        });
                    } else {
                        // Native -> English (Question: Native Word, Answer: Meaning)
                        // We CAN send nativeWord to show the banner
                        exercises.push({
                            type: 'multiple-choice',
                            question: `What does '${vWord}' mean?`,
                            options: [vMeaning, ...distractors].sort(() => 0.5 - Math.random()),
                            correctAnswer: vMeaning,
                            imageUrl: imageService.generateImageUrl(v.imagePrompt || vMeaning),
                            nativeWord: vWord // Show in banner
                        });
                    }
                }
            });

            // 2. Match Pairs Exercise (New)
            if (shuffledVocab.length >= 4) {
                const pairs = shuffledVocab.slice(0, 4).map(v => ({
                    left: v.word,
                    right: v.meaning
                }));

                exercises.push({
                    type: 'match-pair',
                    question: 'Match the pairs',
                    pairs: pairs
                });
            }

            // 2. Listening Practice
            if (vocabulary.length > 0) {
                const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
                const vWord = String(v.word || "").trim();
                const otherWords = vocabulary
                    .filter(i => String(i.word || "").trim() !== vWord)
                    .map(i => String(i.word || "").trim());

                exercises.push({
                    type: 'listening',
                    question: `Listen and select the correct word.`,
                    audioText: vWord,
                    options: [vWord, ...otherWords.slice(0, 3)].sort(() => 0.5 - Math.random()),
                    correctAnswer: vWord,
                    imageUrl: imageService.generateImageUrl(v.imagePrompt || vWord),
                    nativeFigure: v.nativeFigure,
                    nativeWord: v.word
                });
            }

            // 3. Fill in the Blanks (Typing)
            if (vocabulary.length > 3) {
                const v = vocabulary[Math.floor(Math.random() * vocabulary.length)];
                const vWord = String(v.word || "").trim();
                const vMeaning = String(v.meaning || "").trim();

                exercises.push({
                    type: 'fill-in-blanks',
                    question: `Translate to ${language}: "${vMeaning}"`,
                    correctAnswer: vWord,
                    imageUrl: imageService.generateImageUrl(v.imagePrompt || vMeaning),
                    nativeFigure: v.nativeFigure,
                    nativeWord: v.word
                });
            }
        }

        // 4. Rearrange Sentence (Skip for Alphabet as it is usually single words)
        const vWithEx = vocabulary.find(v => v.example?.native);
        if (vWithEx && themeId !== 'alphabet') {
            const originalText = String(vWithEx.example.native || "").trim();
            const englishText = String(vWithEx.example.english || "").trim();

            // Better split logic for regional languages
            const words = originalText.split(/[ ,?।!.-]+/).filter(w => w.length > 0);

            exercises.push({
                type: 'rearrange',
                question: `Translate to ${language}: "${englishText}"`,
                words: [...words].sort(() => 0.5 - Math.random()), // Source bank
                correctAnswer: words // Target array
            });
        }

        const newLesson = new Lesson({
            chapterId: chapterId,
            title: chapterTitle || "New Lesson",
            language,
            level: 'Beginner',
            vocabulary: vocabulary.map(v => {
                const searchKeyword = v.meaning || v.word;

                return {
                    wordNative: v.word,
                    nativeFigure: v.nativeFigure,
                    transliteration: v.transliteration,
                    englishMeaning: v.meaning,
                    pronunciation: v.pronunciation || v.pronunciationHint,
                    // Legacy support
                    word: v.word,
                    meaning: v.meaning,
                    pronunciationHint: v.pronunciation || v.pronunciationHint,
                    example: v.example ? {
                        native: v.example.native,
                        transliteration: v.example.transliteration,
                        english: v.example.english
                    } : null,
                    imagePrompt: searchKeyword,
                    imageUrl: imageService.generateImageUrl(searchKeyword),
                    sentenceImagePrompt: v.example?.english || null,
                    sentenceImageUrl: v.example?.english ? imageService.generateImageUrl(v.example.english) : null,
                    ttsScript: v.word
                };
            }),
            phonetics: phonetics.map(p => ({
                title: p.title,
                description: p.description,
                imagePrompt: p.imagePrompt,
                tip: p.tip,
                tips: p.tips,
                example: p.example,
                examples: p.examples
            })),
            grammar: themeContent.grammar || {
                title: 'Concept Introduction',
                explanation: `In this lesson, you will learn the basics of ${chapterTitle} in ${language}.`
            },
            exampleSentences: vocabulary.filter(v => v.example).map(v => {
                const searchKeyword = v.meaning || v.word;
                const sentenceKeyword = v.example.english;
                return {
                    target: v.example.native,
                    translation: v.example.english,
                    transliteration: v.example.transliteration,
                    imagePrompt: searchKeyword,
                    imageUrl: imageService.generateImageUrl(searchKeyword),
                    sentenceImageUrl: sentenceKeyword ? imageService.generateImageUrl(sentenceKeyword) : imageService.generateImageUrl(searchKeyword)
                };
            }),
            exercises: exercises
        });

        await newLesson.save();
        res.json(newLesson);
    } catch (err) {
        console.error("DEBUG: Lesson Generation Error:", err);
        res.status(500).send('Server Error');
    }
};

// @desc    Get lesson by ID
exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ msg: 'Lesson not found' });
        res.json(lesson);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Submit answer and award XP
exports.submitAnswer = async (req, res) => {
    const { lessonId, score, accuracy } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const xpEarned = Math.round(score * (accuracy / 100));

        user.totalXP = (user.totalXP || 0) + xpEarned;

        // Streak Logic
        const now = new Date();
        if (user.streak && user.streak.lastActivity) {
            const last = new Date(user.streak.lastActivity);
            const diff = (now - last) / (1000 * 60 * 60 * 24);
            if (diff < 2 && diff >= 1) {
                user.streak.count += 1;
            } else if (diff >= 2) {
                user.streak.count = 1;
            }
        } else {
            user.streak = { count: 1, lastActivity: now };
        }
        user.streak.lastActivity = now;


        // Save Lesson History
        if (!user.lessonHistory) user.lessonHistory = [];
        user.lessonHistory.push({
            lessonId,
            score,
            totalQuestions: Math.round(score / (accuracy / 100)) || 0, // Approximate total based on score/accuracy
            accuracy,
            date: now
        });

        await user.save();

        // Mark lesson's chapter as completed
        const lesson = await Lesson.findById(lessonId);
        if (lesson) {
            const course = await Course.findOne({ "sections.chapters.chapterId": lesson.chapterId });
            if (course) {
                const enrollmentIdx = user.enrolledCourses.findIndex(ec => ec.courseId && ec.courseId.toString() === course._id.toString());
                if (enrollmentIdx > -1) {
                    if (!user.enrolledCourses[enrollmentIdx].completedChapters.includes(lesson.chapterId)) {
                        user.enrolledCourses[enrollmentIdx].completedChapters.push(lesson.chapterId);
                        let totalChapters = 0;
                        course.sections.forEach(s => totalChapters += s.chapters.length);
                        user.enrolledCourses[enrollmentIdx].progress = Math.round((user.enrolledCourses[enrollmentIdx].completedChapters.length / totalChapters) * 100);
                    }

                    // Update Chapter Progress (Stars/Score)
                    // Remove existing entry for this chapter if any
                    if (!user.enrolledCourses[enrollmentIdx].chapterProgress) {
                        user.enrolledCourses[enrollmentIdx].chapterProgress = [];
                    }
                    user.enrolledCourses[enrollmentIdx].chapterProgress = user.enrolledCourses[enrollmentIdx].chapterProgress.filter(cp => cp.chapterId !== lesson.chapterId);

                    // Add new entry
                    // Calculate stars: >90% = 3, >70% = 2, >50% = 1
                    let stars = 1;
                    if (accuracy >= 90) stars = 3;
                    else if (accuracy >= 70) stars = 2;

                    user.enrolledCourses[enrollmentIdx].chapterProgress.push({
                        chapterId: lesson.chapterId,
                        score: score,
                        stars: stars,
                        accuracy: accuracy,
                        date: now
                    });

                    await user.save();
                    console.log(`DEBUG: Progress updated for user ${user.username}. Chapter ${lesson.chapterId} marked as finished.`);
                }
            } else {
                console.log(`DEBUG: User not enrolled in course ${course._id}`);
            }
        }
        res.json({ xpEarned, totalXP: user.totalXP, streak: user.streak.count, progress: user.enrolledCourses });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Internal helper to get structured courses (seeds if empty)
const getRawCourses = async () => {
    let courses = await Course.find().sort({ orderIndex: 1 });

    // Force re-seed if courses don't have the 9-section structure
    const needsReseed = courses.length === 0 ||
        !courses[0].sections ||
        courses[0].sections.length < 1 ||
        courses[0].sections[0].chapters.length < 9;

    if (needsReseed) {
        console.log('🔄 Re-seeding Duolingo-style curriculum (9-section update)...');
        const languages = [
            { title: 'English', code: 'EN' }, { title: 'Hindi', code: 'HI' },
            { title: 'Marathi', code: 'MR' }, { title: 'Tulu', code: 'TU' },
            { title: 'Gujarati', code: 'GU' }, { title: 'Punjabi', code: 'PA' },
            { title: 'Kannada', code: 'KN' }, { title: 'Telugu', code: 'TE' },
            { title: 'Tamil', code: 'TA' }, { title: 'Malayalam', code: 'ML' },
            { title: 'Bengali', code: 'BN' }, { title: 'Assamese', code: 'AS' },
            { title: 'Odia', code: 'OR' }, { title: 'Urdu', code: 'UR' },
            { title: 'Sanskrit', code: 'SA' }, { title: 'Nepali', code: 'NE' },
            { title: 'Konkani', code: 'KO' }, { title: 'French', code: 'FR' },
            { title: 'German', code: 'DE' }, { title: 'Spanish', code: 'ES' },
            { title: 'Italian', code: 'IT' }, { title: 'Portuguese', code: 'PT' },
            { title: 'Russian', code: 'RU' }, { title: 'Japanese', code: 'JA' },
            { title: 'Korean', code: 'KO-KR' }, { title: 'Chinese (Mandarin)', code: 'ZH' },
            { title: 'Arabic', code: 'AR' }
        ];

        const mockCourses = languages.map((lang, index) => {
            const generateChapters = () => {
                const defaultSections = [
                    { id: 'greetings', title: 'Greetings & Basics' },
                    { id: 'alphabet', title: 'Alphabet & Phonics' },
                    { id: 'barakhadi', title: 'Barakhadi (Combinations)' },
                    { id: 'numbers', title: 'Numbers (1 - 1M)' },
                    { id: 'family', title: 'Family & Relations' }
                ];

                return (curriculumData.sections || defaultSections).map((sec, i) => ({
                    chapterId: `${lang.code.toLowerCase()}_${sec.id}`,
                    title: sec.title,
                    lessons: [],
                    order: i + 1
                }));
            };

            return {
                title: `${lang.title} Mastery`,
                language: lang.title,
                level: 'Beginner',
                description: `A comprehensive journey from ${lang.title} basics to full fluency.`,
                orderIndex: index,
                sections: [
                    { title: 'Beginner', chapters: generateChapters() }
                ]
            };
        });

        await Course.deleteMany({});
        await Course.insertMany(mockCourses);
        courses = await Course.find().sort({ orderIndex: 1 });
        console.log('✅ Curriculum re-seeded successfully.');
    }
    return courses;
};

// @desc    Get all available courses
exports.getCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const courses = await getRawCourses();
        const coursesWithProgress = courses.map(course => {
            const enrollment = user.enrolledCourses.find(ec => ec.courseId && ec.courseId.toString() === course._id.toString());
            if (!enrollment) { // Handle non-enrolled courses
                return {
                    ...(course._doc || course.toObject()),
                    isEnrolled: false,
                    progress: 0,
                    completedChapters: [],
                    chapterProgress: []
                };
            }
            return {
                ...(course._doc || course.toObject()),
                isEnrolled: true,
                progress: enrollment.progress,
                completedChapters: enrollment.completedChapters,
                chapterProgress: enrollment.chapterProgress || []
            };
        });
        res.json(coursesWithProgress);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Get course by ID
exports.getCourseById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const courseId = req.params.courseId;
        const courses = await getRawCourses();
        const course = courses.find(c => c._id.toString() === courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        const enrollment = user.enrolledCourses.find(ec => ec.courseId && ec.courseId.toString() === courseId);
        res.json({
            ...(course._doc || course.toObject()),
            isEnrolled: !!enrollment,
            progress: enrollment ? enrollment.progress : 0,
            completedChapters: enrollment ? (enrollment.completedChapters || enrollment.completedLessons || []) : []
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Enroll in a course
exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const user = await User.findById(req.user.id);
        const isEnrolled = user.enrolledCourses.some(ec => ec.courseId && ec.courseId.toString() === courseId);
        if (isEnrolled) return res.status(200).json({ msg: 'Already enrolled' });

        user.enrolledCourses.push({
            courseId: courseId, progress: 0, completedChapters: [], dateEnrolled: new Date()
        });
        await user.save();
        res.json({ msg: 'Success' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Update progress
exports.updateProgress = async (req, res) => {
    const { courseId, chapterId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const ci = user.enrolledCourses.findIndex(ec => ec.courseId && ec.courseId.toString() === courseId);
        if (ci > -1) {
            if (!user.enrolledCourses[ci].completedChapters.includes(chapterId)) {
                user.enrolledCourses[ci].completedChapters.push(chapterId);
                const courses = await getRawCourses();
                const course = courses.find(c => c._id.toString() === courseId);
                let total = 0;
                course.sections.forEach(s => total += s.chapters.length);
                user.enrolledCourses[ci].progress = Math.round((user.enrolledCourses[ci].completedChapters.length / total) * 100);
                await user.save();
            }
            res.json(user.enrolledCourses[ci]);
        } else {
            res.status(404).json({ msg: 'Not enrolled' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
