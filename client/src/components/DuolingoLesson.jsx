import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faVolumeHigh, 
    faMicrophone, 
    faCheck, 
    faXmark, 
    faArrowRight, 
    faLightbulb,
    faStar,
    faFire,
    faRotate,
    faBook,
    faTableList
} from '@fortawesome/free-solid-svg-icons';

const DEVANAGARI_MATRAS = [
    { symbol: '', label: 'a' },
    { symbol: 'ा', label: 'aa' },
    { symbol: 'ि', label: 'i' },
    { symbol: 'ी', label: 'ee' },
    { symbol: 'ु', label: 'u' },
    { symbol: 'ू', label: 'oo' },
    { symbol: 'ृ', label: 'ru' },
    { symbol: 'े', label: 'e' },
    { symbol: 'ै', label: 'ai' },
    { symbol: 'ो', label: 'o' },
    { symbol: 'ौ', label: 'au' },
    { symbol: 'ं', label: 'am' },
    { symbol: 'ः', label: 'ah' }
];

const VocabularyCard = ({ vocab, speak }) => {
    const [showBarakhadi, setShowBarakhadi] = useState(false);
    
    // Check if it's a consonant to show Barakhadi option
    const isConsonant = vocab.meaning && vocab.meaning.toLowerCase().includes('consonant');
    
    // Color mapping for colors section
    const colorMap = {
        'red': '#EF4444',
        'yellow': '#FBBF24',
        'blue': '#3B82F6',
        'green': '#10B981',
        'black': '#1F2937',
        'white': '#F9FAFB',
        'orange': '#F97316',
        'purple': '#A855F7',
        'pink': '#EC4899',
        'brown': '#92400E',
        'gray': '#6B7280',
        'grey': '#6B7280',
        'golden': '#F59E0B',
        'silver': '#D1D5DB',
        'light pink': '#FBE7F3',
        'dark blue': '#1E3A8A',
        'sky blue': '#7DD3FC',
        'lime green': '#84CC16',
        'dark green': '#065F46',
        'maroon': '#7F1D1D',
        'crimson': '#DC2626',
        'peacock blue': '#0891B2',
        'teal': '#14B8A6',
        'turquoise': '#06B6D4',
        'violet': '#8B5CF6',
        'navy blue': '#1E40AF',
        'beige': '#F5F5DC',
        'earthy': '#D2691E',
        'tan': '#D2B48C',
        'mustard yellow': '#E4A11B',
        'mustard': '#E4A11B',
        'magenta': '#D946EF',
        'rainbow': 'linear-gradient(90deg, #EF4444, #F97316, #FBBF24, #10B981, #3B82F6, #A855F7)',
        'color': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'light': '#F3F4F6',
        'pale': '#F3F4F6',
        'dark': '#374151',
        'bright': '#FCD34D',
        'shiny': '#FCD34D',
        'dull': '#9CA3AF'
    };
    
    
    
    
    // Detect if this is a color vocabulary item
    // CRITICAL: If vocab has an icon, it's NOT a color item (it's a shape or fruit)
    const hasIcon = Boolean(vocab.icon);
    const meaningLower = (vocab.meaning || vocab.englishMeaning || '').toLowerCase().trim();
    
    // Only check for colors if there's NO icon
    let isColor = false;
    let colorValue = null;
    
    if (!hasIcon) {
        // Check if the meaning is EXACTLY a color or starts with a color word
        const isExactColorMatch = (meaning, colorKey) => {
            const patterns = [
                meaning === colorKey,                           // Exact match: "red"
                meaning.startsWith(colorKey + ' '),            // Starts with: "red color"
                meaning.startsWith(colorKey + '/'),            // Variant: "light/pale"
                meaning.endsWith('/' + colorKey),              // Variant: "pale/light"
                meaning === colorKey.replace('/', ' '),        // Space variant
            ];
            return patterns.some(p => p);
        };
        
        isColor = Object.keys(colorMap).some(color => isExactColorMatch(meaningLower, color));
        colorValue = isColor ? Object.entries(colorMap).find(([key]) => isExactColorMatch(meaningLower, key))?.[1] : null;
    }
    
    
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-surface p-8 rounded-[3rem] border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-300 relative h-full min-h-[500px]"
        >
            {/* Native Figure Box */}
            {vocab.nativeFigure && (
                <div className="mb-8 w-full flex justify-center px-2">
                    <div className="bg-primary/5 px-6 py-4 rounded-[2.5rem] ring-4 ring-primary/10 shadow-sm transition-all group-hover:bg-primary/10 group-hover:scale-110 duration-500 border border-primary/10 min-w-fit max-w-full overflow-visible">
                        <span className={`font-black text-primary/80 leading-none whitespace-nowrap
                            ${(vocab.nativeFigure || "").length > 8 ? 'text-3xl' : 'text-5xl'}
                        `}>
                            {vocab.nativeFigure}
                        </span>
                    </div>
                </div>
            )}

            {/* Color Indicator Box - Only for colors section */}
            {isColor && colorValue && !vocab.icon && (
                <div className="mb-6 w-full flex justify-center">
                    <div 
                        className="w-24 h-24 rounded-[2rem] shadow-lg ring-4 ring-white/50 transition-all group-hover:scale-110 group-hover:shadow-xl duration-300"
                        style={{ 
                            background: colorValue,
                            border: meaningLower.includes('white') || meaningLower.includes('light') || meaningLower.includes('pale') ? '2px solid #E5E7EB' : 'none'
                        }}
                    ></div>
                </div>
            )}

            {/* Icon/Emoji Box - For shapes and fruits sections */}
            {vocab.icon && (
                <div className="mb-6 w-full flex justify-center">
                    <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg ring-4 ring-primary/10 transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:ring-primary/20 duration-300 flex items-center justify-center border border-primary/10">
                        <span className="text-6xl">{vocab.icon}</span>
                    </div>
                </div>
            )}

            {/* Native Word Box */}
            <div className="w-full bg-primary/5 rounded-[2rem] p-6 mb-4 border border-primary/10 flex items-center justify-center min-h-[120px] px-4">
                <h3 className="font-black text-primary tracking-tight leading-tight uppercase text-4xl">
                    {vocab.wordNative || vocab.word}
                </h3>
            </div>
            <p className="text-xl text-text opacity-40 font-bold italic mb-3">"{vocab.transliteration}"</p>
            <div className="h-1 w-12 bg-primary/10 rounded-full mb-6" />
            <p className="text-2xl font-black text-text italic tracking-wide mb-8">{vocab.englishMeaning || vocab.meaning}</p>
            
            {showBarakhadi && (
                <div className="w-full bg-background/50 rounded-2xl p-4 grid grid-cols-4 gap-2 mb-6">
                    {DEVANAGARI_MATRAS.map((m, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-primary">{(vocab.wordNative || vocab.word) + m.symbol}</span>
                            <span className="text-[10px] opacity-40 font-black">{m.label}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-4 mt-6">
                {isConsonant && (
                    <button 
                        onClick={() => setShowBarakhadi(!showBarakhadi)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${showBarakhadi ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                    >
                        <FontAwesomeIcon icon={faTableList} className="mr-2" />
                        {showBarakhadi ? 'CLOSE BARAKHADI' : 'VIEW BARAKHADI'}
                    </button>
                )}
                
                <button 
                    onClick={() => speak(vocab.wordNative || vocab.word)}
                    className="bg-primary text-white px-6 py-2 rounded-xl font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <FontAwesomeIcon icon={faVolumeHigh} className="mr-2" />
                    LISTEN
                </button>
            </div>
        </motion.div>
    );
};

const PhoneticCard = ({ tip }) => {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-10 rounded-[3rem] border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-300"
        >
            <h3 className="text-3xl font-black text-primary mb-3 tracking-tight">{tip.title}</h3>
            <p className="text-lg text-text opacity-70 font-bold leading-relaxed mb-4">{tip.description}</p>
        </motion.div>
    );
};

const DuolingoLesson = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // 0: Vocabulary/Grammar, 1+: Exercises
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showCorrection, setShowCorrection] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [rearrangeWords, setRearrangeWords] = useState([]);
    const [selectedRearrange, setSelectedRearrange] = useState([]);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [xpEarned, setXpEarned] = useState(0);
    const [correctionReason, setCorrectionReason] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    // Speech Recognition
    const [isListening, setIsListening] = useState(false);
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = speechRecognition ? new speechRecognition() : null;

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get(`http://localhost:5000/api/learning/lessons/${lessonId}`, config);
                console.log("DEBUG: Lesson Data Received:", res.data);
                setLesson(res.data);
                setExercises(res.data.exercises || []);
            } catch (err) {
                console.error("Error fetching lesson", err);
                const mock = {
                    title: "Greetings",
                    language: "Spanish",
                    vocabulary: [{ word: "Hola", meaning: "Hello", pronunciationHint: "OH-lah", transliteration: "Hola" }],
                    grammar: { title: "Basics", explanation: "Spanish greetings are essential." },
                    exercises: [
                        { type: 'multiple-choice', question: "How do you say 'Hello'?", options: ["Hola", "Adiós"], correct_answer: "Hola" },
                        { type: 'rearrange', question: "Rearrange: Hello, how are you?", words: ["Hola,", "¿cómo", "estás?"], correct_answer: ["Hola,", "¿cómo", "estás?"] }
                    ]
                };
                setLesson(mock);
                setExercises(mock.exercises);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId]);

    const getStableSeed = (str) => {
        if (!str) return 42;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash) % 1000;
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lesson?.language === 'Spanish' ? 'es-ES' : 'hi-IN';
        window.speechSynthesis.speak(utterance);
    };

    const handleSpeech = () => {
        if (!recognition) return alert("Speech recognition not supported in this browser.");
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSelectedOption(transcript);
            setIsListening(false);
            checkAnswer(transcript);
        };
    };

    const checkAnswer = (answer) => {
        const currentExercise = exercises[currentIndex - 1];
        if (!currentExercise) return console.error("No active exercise found at index", currentIndex);

        let correct = false;
        
        // Robust normalization helper
        const normalize = (val) => {
            if (Array.isArray(val)) {
                // For rearrange: join with single space and treat as a sentence
                return val.map(v => String(v || "").trim()).filter(v => v !== "").join(' ').toLowerCase().normalize('NFC');
            }
            return String(val || "").trim().toLowerCase().normalize('NFC');
        };

        const userAns = normalize(answer);
        const correctAns = normalize(currentExercise.correctAnswer || currentExercise.correct_answer);

        let reason = "";
        
        if (currentExercise.type === 'match-pair') {
            const matches = answer ? JSON.parse(answer) : [];
            correct = matches.length === (currentExercise.pairs.length * 2);
            if (!correct) reason = "Match all pairs to complete!";
        } else {
            correct = userAns === correctAns;
        }

        if (!correct) {
            if (currentExercise.type === 'rearrange') {
                const userWords = Array.isArray(answer) ? answer : [answer];
                const correctWords = Array.isArray(currentExercise.correctAnswer || currentExercise.correct_answer) 
                    ? (currentExercise.correctAnswer || currentExercise.correct_answer) 
                    : [currentExercise.correctAnswer || currentExercise.correct_answer];
                
                if (userWords.length < correctWords.length) {
                    reason = "Keep going! Some words are missing.";
                } else if (userWords.length === correctWords.length) {
                    // Check if it's just the order
                    const sortedUser = [...userWords].sort();
                    const sortedCorrect = [...correctWords].sort();
                    const sameWords = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
                    reason = sameWords ? "Almost! The words are right, but the order is wrong." : "Double check your word choices.";
                } else {
                    reason = "Too many words! Check the sentence again.";
                }
            } else if (currentExercise.type === 'fill-in-blanks' || currentExercise.type === 'voice') {
                // Simple typo detection (levenshtein-ish)
                const dist = (a, b) => {
                    if (!a || !b) return Math.abs((a || "").length - (b || "").length);
                    const matrix = [];
                    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
                    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
                    for (let i = 1; i <= b.length; i++) {
                        for (let j = 1; j <= a.length; j++) {
                            if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
                            else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                        }
                    }
                    return matrix[b.length][a.length];
                };
                const distance = dist(userAns, correctAns);
                if (distance <= 2) reason = "So close! Just a small spelling mistake.";
                else reason = "Not quite. Check the spelling out loud.";
            } else {
                reason = "That's not it. Try another option!";
            }
        }

        setCorrectionReason(reason);
        setIsCorrect(correct);
        setShowCorrection(true);
        if (correct) {
            setXpEarned(prev => prev + 10);
            setCorrectionReason("Amazing! You got it right.");
        }
    };

    const tryAgain = () => {
        setIsCorrect(null);
        setShowCorrection(false);
        setCorrectionReason("");
        // We don't reset selections, let the user change them
    };

    const refreshLesson = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.post('http://localhost:5000/api/learning/generate-lesson', {
                language: lesson.language,
                level: lesson.level,
                chapterTitle: lesson.title,
                chapterId: lesson.chapterId
            }, config);
            
            if (res.data?._id) {
                navigate(`/lesson/${res.data._id}`);
                window.location.reload(); 
            }
        } catch (err) {
            console.error("Refresh failed", err);
            setLoading(false);
        }
    };

    const nextStep = async () => {
        setShowCorrection(false);
        setIsCorrect(null);
        setCorrectionReason("");
        setSelectedOption(null);
        setSelectedRearrange([]);
        setTypedAnswer("");
        setRearrangeWords([]);
        
        if (currentIndex < exercises.length) {
            setCurrentIndex(prev => prev + 1);
            setProgress(((currentIndex + 1) / (exercises.length + 1)) * 100);
        } else {
            // Lesson Complete
            setIsComplete(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.post('http://localhost:5000/api/learning/submit-answer', {
                    lessonId,
                    score: xpEarned,
                    accuracy: (xpEarned / (exercises.length * 10)) * 100
                }, config);
            } catch (err) {
                console.error("Error submitting progress", err);
            }
        }
    };

    if (loading) return <div className="p-12 text-center text-text opacity-50">Loading Lesson Experience...</div>;

    if (isComplete) {
        return (
            <div className="max-w-md mx-auto p-8 text-center space-y-8 h-screen flex flex-col justify-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl">🎉</motion.div>
                <h1 className="text-4xl font-black text-text">Lesson Complete!</h1>
                <div className="flex justify-center gap-8">
                    <div className="bg-yellow-100 p-4 rounded-2xl w-32 border border-yellow-200">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-2xl mb-2" />
                        <div className="font-black text-2xl text-yellow-700">+{xpEarned}</div>
                        <div className="text-xs font-bold text-yellow-600">XP EARNED</div>
                    </div>
                    <div className="bg-orange-100 p-4 rounded-2xl w-32 border border-orange-200">
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 text-2xl mb-2" />
                        <div className="font-black text-2xl text-orange-700">7 Days</div>
                        <div className="text-xs font-bold text-orange-600">STREAK</div>
                    </div>
                </div>
                <button 
                    onClick={async () => {
                        // Check for redirect from alphabet -> barakhadi
                        if (lesson?.chapterId?.includes('_alphabet')) {
                            const barakhadiId = lesson.chapterId.replace('_alphabet', '_barakhadi');
                            try {
                                const token = localStorage.getItem('token');
                                const config = { headers: { 'x-auth-token': token } };
                                const res = await axios.post('http://localhost:5000/api/learning/generate-lesson', {
                                    language: lesson.language,
                                    level: lesson.level,
                                    chapterTitle: 'Barakhadi (Combinations)',
                                    chapterId: barakhadiId
                                }, config);
                                navigate(`/lesson/${res.data._id}`);
                                window.location.reload(); 
                                return;
                            } catch (err) {
                                console.error("Auto-redirect to Barakhadi failed", err);
                            }
                        }
                        navigate('/learning');
                    }}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:scale-105 transition-all"
                >
                    {lesson?.chapterId?.includes('_alphabet') ? 'NEXT: BARAKHADI →' : 'CONTINUE'}
                </button>
            </div>
        );
    }

    const currentExercise = (exercises && currentIndex > 0) 
        ? exercises[currentIndex - 1] 
        : { type: 'intro', question: '', options: [], words: [], correctAnswer: '' };

    return (
        <div className="max-w-4xl mx-auto h-screen flex flex-col p-4 md:p-8">
            {/* Header / Progress */}
            <header className="flex items-center gap-6 mb-12">
                <button onClick={() => navigate('/learning')} className="text-text/40 hover:text-text transition p-2 hover:bg-text/5 rounded-xl">
                    <FontAwesomeIcon icon={faXmark} className="text-2xl" />
                </button>
                <div className="flex-1 bg-text/5 h-4 rounded-full overflow-hidden border border-text/5 shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="bg-primary h-full rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={refreshLesson}
                        className="px-4 py-2 rounded-xl bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 transition shadow-lg font-black text-sm"
                    >
                        <FontAwesomeIcon icon={faRotate} />
                        <span>RESTART</span>
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-500 rounded-xl font-black shadow-sm">
                        <FontAwesomeIcon icon={faStar} />
                        <span>{xpEarned}</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col">
                <AnimatePresence mode="wait">
                    {currentIndex === 0 ? (
                        <motion.div 
                            key="intro"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl font-black text-text mb-2">New Vocabulary</h2>
                            <p className="text-text/40 font-bold mb-10 uppercase tracking-[0.2em] text-sm">Essential words and greetings</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {lesson.vocabulary.map((vocab, i) => (
                                    <VocabularyCard 
                                        key={i} 
                                        vocab={vocab} 
                                        speak={speak} 
                                    />
                                ))}
                            </div>

                            {/* Simplified Phonics Guide */}
                            {lesson.phonetics && lesson.phonetics.length > 0 && (
                                <div className="space-y-10 mt-24 mb-12">
                                    <div className="bg-text/[0.02] p-10 md:p-16 rounded-[4rem] border border-text/5 shadow-2xl">
                                        <div className="flex flex-col md:flex-row items-baseline gap-4 mb-12 text-center md:text-left">
                                            <h2 className="text-4xl font-black text-text">Mastery Tips</h2>
                                            <div className="h-2 w-2 rounded-full bg-primary/40 hidden md:block" />
                                            <p className="text-text/40 font-bold uppercase tracking-widest text-sm">Techniques & Patterns</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {lesson.phonetics.map((tip, i) => (
                                                <PhoneticCard 
                                                    key={i} 
                                                    tip={tip} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={`ex-${currentIndex}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl font-black text-text opacity-40 uppercase tracking-widest">{currentExercise.type.replace('-', ' ')}</h2>
                            
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-surface/50 p-12 rounded-[3.5rem] border-2 border-text/5 justify-center text-center shadow-xl overflow-visible">
                                {(currentExercise.nativeFigure || currentExercise.nativeWord) ? (
                                    <div className="flex flex-col items-center gap-6 w-full max-w-2xl px-4">
                                        {/* Exercise Figure Box - Only show if figure is the prompt */}
                                        {currentExercise.nativeFigure && (
                                            <div className="bg-primary/5 px-10 py-5 rounded-[2.5rem] ring-4 ring-primary/10 shadow-inner border border-primary/10 mb-2 min-w-fit max-w-full overflow-visible">
                                                <span className={`font-black text-primary/40 leading-none whitespace-nowrap
                                                    ${(currentExercise.nativeFigure || "").length > 8 ? 'text-3xl' : 'text-6xl'}
                                                `}>
                                                    {currentExercise.nativeFigure}
                                                </span>
                                            </div>
                                        )}

                                        {/* Exercise Word Box - Only show if word is the prompt */}
                                        {currentExercise.nativeWord && (
                                            <div className="w-full bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex items-center justify-center min-h-[120px] px-6">
                                                <p className="font-black text-primary tracking-tight leading-tight uppercase text-5xl">
                                                    {currentExercise.nativeWord}
                                                </p>
                                            </div>
                                        )}

                                        <p className="text-2xl font-bold text-text/40 italic uppercase tracking-widest border-t border-text/5 pt-6 w-[80%]">
                                            {currentExercise.question}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-5xl font-black text-primary p-12">{currentExercise.question}</p>
                                )}
                            </div>

                            {/* Multiple Choice / Listening / Typing */}
                            {(currentExercise.type === 'multiple-choice' || currentExercise.type === 'listening' || currentExercise.type === 'fill-in-blanks') && (
                                <div className="grid grid-cols-1 gap-8">
                                    {currentExercise.type === 'listening' && (
                                        <div className="flex justify-center mb-4">
                                            <button 
                                                onClick={() => speak(currentExercise.audioText)}
                                                className="w-32 h-32 bg-primary rounded-3xl text-white text-5xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 transition active:scale-95"
                                            >
                                                <FontAwesomeIcon icon={faVolumeHigh} />
                                            </button>
                                        </div>
                                    )}

                                    {currentExercise.type === 'fill-in-blanks' ? (
                                        <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
                                            <input 
                                                type="text"
                                                value={typedAnswer}
                                                onChange={(e) => setTypedAnswer(e.target.value)}
                                                placeholder="Type the answer here..."
                                                className="w-full bg-surface p-6 rounded-2xl border-2 border-primary/20 text-3xl font-bold text-center focus:border-primary focus:outline-none transition-all"
                                                autoFocus
                                            />
                                            <p className="text-center text-text opacity-40 font-bold uppercase tracking-widest text-sm">Type in {lesson.language}</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentExercise.options.map((option, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedOption(option)}
                                                    disabled={showCorrection}
                                                    className={`p-6 rounded-3xl border-2 text-xl font-bold transition-all text-left flex items-center gap-4 ${
                                                        selectedOption === option 
                                                            ? 'border-primary bg-primary/5 text-primary scale-[1.02]' 
                                                            : 'border-text/10 hover:border-text/20 text-text'
                                                    }`}
                                                >
                                                    <span className="w-10 h-10 rounded-xl bg-text/5 flex items-center justify-center text-base">{i + 1}</span>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}


                                    {/* Rearrange Sentence */}
                                    {currentExercise.type === 'rearrange' && (
                                        <div className="space-y-12">
                                            {/* Target Area (Dashed Box) */}
                                            <div className="min-h-[140px] p-8 bg-surface rounded-[2.5rem] border-4 border-dashed border-text/10 flex flex-wrap gap-4 items-center shadow-inner">
                                                {selectedRearrange.length === 0 ? (
                                                    <p className="text-text/20 font-black text-2xl mx-auto italic uppercase tracking-widest">Build the sentence</p>
                                                ) : (
                                                    selectedRearrange.map((word, i) => (
                                                        <button 
                                                            key={i} 
                                                            onClick={() => {
                                                                if (showCorrection && isCorrect) return;
                                                                setSelectedRearrange(prev => prev.filter((_, idx) => idx !== i));
                                                            }}
                                                            className="bg-white px-8 py-4 rounded-2xl border-2 border-text/10 font-bold text-2xl shadow-sm hover:border-primary hover:text-primary transition active:scale-95 group"
                                                        >
                                                            {word}
                                                            <span className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity">×</span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                            
                                            {/* Source Area (Words Deck) */}
                                            <div className="flex flex-wrap justify-center gap-4 bg-text/[0.02] p-8 rounded-[2.5rem]">
                                                {((currentExercise.words && currentExercise.words.length > 0) 
                                                    ? currentExercise.words 
                                                    : (Array.isArray(currentExercise.correctAnswer || currentExercise.correct_answer) 
                                                        ? [...(currentExercise.correctAnswer || currentExercise.correct_answer)].sort(() => 0.5 - Math.random()) 
                                                        : [])
                                                ).map((word, i) => {
                                                    const usedCount = selectedRearrange.filter(w => w === word).length;
                                                    const deckWords = (currentExercise.words && currentExercise.words.length > 0) ? currentExercise.words : (currentExercise.correctAnswer || currentExercise.correct_answer);
                                                    const totalCount = Array.isArray(deckWords) ? deckWords.filter(w => w === word).length : 0;
                                                    const isUsed = usedCount >= totalCount;

                                                    return (
                                                        <button 
                                                            key={i} 
                                                            disabled={isUsed || (showCorrection && isCorrect)}
                                                            onClick={() => setSelectedRearrange(prev => [...prev, word])}
                                                            className={`px-8 py-4 rounded-2xl border-2 font-bold text-2xl transition-all shadow-sm active:scale-95 ${
                                                                isUsed 
                                                                    ? 'bg-text/5 border-transparent text-transparent pointer-events-none select-none' 
                                                                    : 'bg-surface border-text/10 hover:border-text/20 text-text hover:-translate-y-1'
                                                            }`}
                                                        >
                                                            {word}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Match Pairs */}
                                    {currentExercise.type === 'match-pair' && (
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-2xl mx-auto">
                                            {(() => {
                                                // Initialize state for shuffled columns if not present
                                                if (!currentExercise._shuffledLeft || !currentExercise._shuffledRight) {
                                                     currentExercise._shuffledLeft = [...currentExercise.pairs].sort(() => 0.5 - Math.random());
                                                     currentExercise._shuffledRight = [...currentExercise.pairs].sort(() => 0.5 - Math.random());
                                                }
                                                // Local state for matched pairs is managed by selectedOption (using a Map or Object logic ideally, but here we might need a custom state)
                                                // BUT DuolingoLesson uses `selectedOption` as a single value string usually. 
                                                // We need a specific state for matching.
                                                // Since we can't easily add new state hooks inside this conditional render without breaking React rules,
                                                // we will repurpose `selectedOption` to hold the currently selected "source" item, 
                                                // and `typedAnswer` (as a JSON string) to hold the list of matched pairs.
                                                
                                                const matches = typedAnswer ? JSON.parse(typedAnswer) : []; // Array of ids or values
                                                const selected = selectedOption; 
                                                
                                                const handleMatchClick = (item, side) => {
                                                    if (showCorrection) return;
                                                    
                                                    // If nothing selected, select this
                                                    if (!selected) {
                                                        setSelectedOption(JSON.stringify({ item, side }));
                                                        return;
                                                    }

                                                    const parsedSelected = JSON.parse(selected);
                                                    
                                                    // If clicked same item or same side, deselect/change
                                                    if (parsedSelected.side === side) {
                                                        setSelectedOption(JSON.stringify({ item, side }));
                                                        return;
                                                    }

                                                    // Attempt match
                                                    const pair = currentExercise.pairs.find(p => 
                                                        (p.left === item && p.right === parsedSelected.item) || 
                                                        (p.right === item && p.left === parsedSelected.item)
                                                    );

                                                    if (pair) {
                                                        // Correct match!
                                                        const newMatches = [...matches, pair.left, pair.right];
                                                        setTypedAnswer(JSON.stringify(newMatches));
                                                        setSelectedOption(null);
                                                        
                                                        // Check if all matched
                                                        if (newMatches.length === currentExercise.pairs.length * 2) {
                                                            // Auto-check? Or let user click Check.
                                                            // We usually wait for user to click check.
                                                        }
                                                    } else {
                                                        // Incorrect match - flash red (simplified here by just resetting)
                                                        setSelectedOption(null);
                                                        // Could add a "shake" effect state here if we had more state variables
                                                        alert("Try again!"); 
                                                    }
                                                };

                                                return (
                                                    <>
                                                        <div className="flex flex-col gap-4">
                                                            {currentExercise._shuffledLeft.map((pair, i) => {
                                                                const val = pair.left;
                                                                const isMatched = matches.includes(val);
                                                                const isSelected = selected && JSON.parse(selected).item === val;
                                                                
                                                                return (
                                                                    <button
                                                                        key={`L-${i}`}
                                                                        disabled={isMatched}
                                                                        onClick={() => handleMatchClick(val, 'left')}
                                                                        className={`p-6 rounded-2xl border-2 text-xl font-bold transition-all shadow-sm ${
                                                                            isMatched ? 'bg-green-100 border-green-200 text-green-600 opacity-50 pointer-events-none' : 
                                                                            isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-text/10 bg-surface text-text hover:bg-surface/80'
                                                                        }`}
                                                                    >
                                                                        {val}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            {currentExercise._shuffledRight.map((pair, i) => {
                                                                const val = pair.right;
                                                                const isMatched = matches.includes(val);
                                                                const isSelected = selected && JSON.parse(selected).item === val;

                                                                return (
                                                                    <button
                                                                        key={`R-${i}`}
                                                                        disabled={isMatched}
                                                                        onClick={() => handleMatchClick(val, 'right')}
                                                                        className={`p-6 rounded-2xl border-2 text-xl font-bold transition-all shadow-sm ${
                                                                            isMatched ? 'bg-green-100 border-green-200 text-green-600 opacity-50 pointer-events-none' : 
                                                                            isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-text/10 bg-surface text-text hover:bg-surface/80'
                                                                        }`}
                                                                    >
                                                                        {val}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}

                            {/* Speaking Practice */}
                            {currentExercise.type === 'speaking' && (
                                <div className="flex flex-col items-center gap-8 py-12">
                                    <div className="text-4xl font-black text-primary bg-primary/5 px-8 py-4 rounded-3xl">{currentExercise.audioText}</div>
                                    <button 
                                        onClick={handleSpeech}
                                        className={`w-40 h-40 rounded-full flex items-center justify-center text-5xl transition-all duration-300 ${
                                            isListening ? 'bg-red-500 scale-110 shadow-2xl shadow-red-500/20 text-white animate-pulse' : 'bg-primary text-white shadow-xl shadow-primary/20'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={faMicrophone} />
                                    </button>
                                    <p className="text-text opacity-40 font-bold tracking-widest uppercase">Tap to speak</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Navigation / Correction */}
            <footer className={`border-t-2 py-8 px-6 transition-all duration-300 ${
                showCorrection 
                    ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') 
                    : 'bg-background border-text/5'
            }`}>
                <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
                    {showCorrection ? (
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg ${
                                isCorrect ? 'bg-green-500 text-white shadow-green-200' : 'bg-red-500 text-white shadow-red-200'
                            }`}>
                                <FontAwesomeIcon icon={isCorrect ? faCheck : faXmark} />
                            </div>
                            <div className="space-y-1">
                                <h4 className={`text-3xl font-black ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    {isCorrect ? 'Great Job!' : 'Incorrect'}
                                </h4>
                                <p className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'} opacity-90 italic`}>
                                    {correctionReason}
                                </p>
                                {!isCorrect && (
                                    <div className="space-y-1">
                                        <p className="text-red-800 font-bold opacity-60 uppercase text-sm tracking-wider">Correct solution:</p>
                                        <p className="text-red-800 font-black text-xl">
                                            {Array.isArray(currentExercise.correctAnswer || currentExercise.correct_answer) 
                                                ? (currentExercise.correctAnswer || currentExercise.correct_answer).join(' ') 
                                                : (currentExercise.correctAnswer || currentExercise.correct_answer)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:block" />
                    )}
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        {showCorrection && !isCorrect && (
                            <button 
                                onClick={tryAgain}
                                className="flex-1 md:flex-none px-12 py-6 rounded-3xl font-black text-2xl bg-white text-red-500 border-2 border-red-200 hover:bg-red-50 shadow-xl transition active:scale-95"
                            >
                                TRY AGAIN
                            </button>
                        )}
                        <button 
                            onClick={showCorrection ? (isCorrect ? nextStep : nextStep) : (currentIndex === 0 ? nextStep : () => checkAnswer(currentExercise.type === 'rearrange' ? selectedRearrange : (currentExercise.type === 'fill-in-blanks' || currentExercise.type === 'match-pair' ? typedAnswer : selectedOption)))}
                            disabled={!showCorrection && currentIndex !== 0 && (currentExercise?.type === 'rearrange' ? selectedRearrange.length === 0 : (currentExercise?.type === 'fill-in-blanks' ? !typedAnswer : (currentExercise?.type === 'match-pair' ? (!typedAnswer || JSON.parse(typedAnswer).length < (currentExercise.pairs.length * 2)) : !selectedOption)))}
                            className={`flex-1 md:flex-none px-16 py-6 rounded-3xl font-black text-2xl transition-all shadow-xl active:scale-95 ${
                                showCorrection 
                                    ? (isCorrect ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-200' : 'bg-red-500 text-white hover:bg-red-600 shadow-red-200')
                                    : (selectedOption || selectedRearrange.length > 0 || typedAnswer || currentIndex === 0 ? 'bg-primary text-white shadow-primary/20 hover:-translate-y-1' : 'bg-text/5 text-text/20 cursor-not-allowed')
                            }`}
                        >
                            {showCorrection ? 'CONTINUE' : (currentIndex === 0 ? 'START' : 'CHECK')}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DuolingoLesson;
