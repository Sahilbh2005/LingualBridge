import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SpeedQuiz = ({ data, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState('active'); // active, finished
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setGameState('finished');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const handleAnswer = (option) => {
        if (gameState !== 'active') return;
        
        if (option === data[currentIndex].answer) {
            setScore(score + 10);
        }
        
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            clearInterval(timerRef.current);
            setGameState('finished');
        }
    };

    if (gameState === 'finished') {
        return (
            <div className="text-center p-12 bg-surface rounded-[3rem] shadow-2xl border border-primary/10">
                <h3 className="text-5xl font-black text-text mb-4">Time's Up! ⏱️</h3>
                <p className="text-2xl text-text opacity-60 mb-8">You scored</p>
                <div className="text-8xl font-black text-primary mb-12 drop-shadow-xl">{score}</div>
                <button 
                    onClick={() => onComplete(score)}
                    className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary/30 hover:scale-105 transition"
                >
                    FINISH GAME
                </button>
            </div>
        );
    }

    const current = data[currentIndex];

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between items-center mb-12">
                <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-lg shadow-orange-500/20">
                    ⏱️ {timeLeft}s
                </div>
                <div className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-2xl shadow-lg shadow-primary/20">
                    Score: {score}
                </div>
            </div>

            <motion.div 
                key={currentIndex}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-surface p-12 rounded-[3rem] shadow-xl border border-text/5 text-center mb-10"
            >
                <h2 className="text-3xl font-black text-text mb-12 leading-tight">
                    {current.question}
                </h2>

                <div className="grid gap-4">
                    {current.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt)}
                            className="w-full p-6 bg-background border-2 border-text/5 rounded-2xl text-xl font-bold text-text hover:border-primary hover:bg-primary/5 hover:scale-[1.02] transition-all"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="w-full bg-background h-3 rounded-full overflow-hidden border border-text/5">
                <motion.div 
                    className="h-full bg-primary"
                    animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
                />
            </div>
            <div className="text-center mt-4 text-xs font-bold opacity-30 uppercase tracking-[0.2em]">
                Challenge {currentIndex + 1} of {data.length}
            </div>
        </div>
    );
};

export default SpeedQuiz;
