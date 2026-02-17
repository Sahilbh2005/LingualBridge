import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ListenPick = ({ data, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const current = data[currentIndex];

    useEffect(() => {
        // Auto-play on mount/next
        playAudio();
    }, [currentIndex]);

    const playAudio = () => {
        if (!current) return;
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(current.audioText);
        // Attempt to find a matching voice if possible (generic for now)
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => setIsPlaying(false);
    };

    const handlePick = (option) => {
        const correct = option === current.correct;
        setIsCorrect(correct);
        setShowCorrection(true);
        
        if (correct) setScore(score + 10);

        setTimeout(() => {
            setShowCorrection(false);
            if (currentIndex < data.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onComplete(score > 0 ? score : 100);
            }
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 text-center">
            <h2 className="text-3xl font-black text-text mb-2">Listen & Pick</h2>
            <p className="text-text opacity-60 mb-12">Click the button, listen, and pick the matching word</p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playAudio}
                className={`w-48 h-48 rounded-full shadow-2xl flex items-center justify-center text-6xl mb-16 mx-auto transition-all ${isPlaying ? 'bg-primary text-white scale-110 shadow-primary/30' : 'bg-surface text-primary border-4 border-primary/20 hover:border-primary/50'}`}
            >
                {isPlaying ? '🔊' : '▶️'}
            </motion.button>

            <div className="grid gap-6">
                {current.options.map((opt, i) => (
                    <motion.button
                        key={i}
                        disabled={showCorrection}
                        onClick={() => handlePick(opt)}
                        className={`p-6 rounded-2xl border-2 font-black text-2xl transition-all
                            ${showCorrection && opt === current.correct ? 'bg-green-100 border-green-500 text-green-700' : 
                              showCorrection && opt !== current.correct ? 'bg-red-50 border-red-200 text-red-300' :
                              'bg-surface border-text/5 hover:border-primary text-text'}`}
                    >
                        {opt}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {showCorrection && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-10 text-2xl font-black ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {isCorrect ? 'Brilliant! 🎉' : `Oops! It was "${current.correct}"`}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="mt-12 flex justify-between text-xs font-bold opacity-30 uppercase tracking-[0.2em]">
                <span>Question {currentIndex + 1} / {data.length}</span>
                <span>Score: {score}</span>
            </div>
        </div>
    );
};

export default ListenPick;
