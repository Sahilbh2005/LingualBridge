import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SentenceBuilder = ({ data, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrambled, setScrambled] = useState([]);
    const [selected, setSelected] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [message, setMessage] = useState('');

    const currentData = data[currentIndex];

    useEffect(() => {
        if (currentData) {
            setScrambled([...currentData.scrambled].sort(() => Math.random() - 0.5));
            setSelected([]);
            setIsCorrect(false);
            setMessage('');
        }
    }, [currentIndex, currentData]);

    const handleWordClick = (word, index, isFromScrambled) => {
        if (isFromScrambled) {
            setSelected([...selected, word]);
            const newScrambled = [...scrambled];
            newScrambled.splice(index, 1);
            setScrambled(newScrambled);
        } else {
            setScrambled([...scrambled, word]);
            const newSelected = [...selected];
            newSelected.splice(index, 1);
            setSelected(newSelected);
        }
    };

    const checkSentence = () => {
        const result = selected.join(' ');
        if (result === currentData.correct) {
            setIsCorrect(true);
            setMessage('Perfect! 🎉');
            setTimeout(() => {
                if (currentIndex < data.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    onComplete(100);
                }
            }, 1500);
        } else {
            setMessage('Try again! Word order matters.');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-text mb-2">Sentence Builder</h2>
                <p className="text-text opacity-60">Arrange the words to form a correct sentence</p>
                <div className="mt-4 px-6 py-2 bg-primary/10 text-primary rounded-full inline-block font-bold">
                    Translate: "{currentData.translation}"
                </div>
            </div>

            {/* Answer Display */}
            <div className="min-h-[120px] bg-background border-4 border-dashed border-text/10 rounded-[2.5rem] p-8 flex flex-wrap gap-3 items-center justify-center mb-12 transition-all">
                {selected.length === 0 && <span className="text-text opacity-20 font-bold uppercase tracking-widest">Click words below to build...</span>}
                <AnimatePresence>
                    {selected.map((word, i) => (
                        <motion.button
                            key={`${word}-${i}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => handleWordClick(word, i, false)}
                            className="px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition"
                        >
                            {word}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Word Bank */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
                <AnimatePresence>
                    {scrambled.map((word, i) => (
                        <motion.button
                            key={`${word}-${i}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => handleWordClick(word, i, true)}
                            className="px-6 py-3 bg-surface border-2 border-text/10 rounded-2xl font-bold text-text hover:border-primary transition shadow-sm"
                        >
                            {word}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col items-center gap-6">
                <button
                    disabled={selected.length === 0}
                    onClick={checkSentence}
                    className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-30 disabled:grayscale transition cursor-pointer"
                >
                    CHECK SENTENCE
                </button>
                <AnimatePresence>
                    {message && (
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`text-xl font-black ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="mt-12 text-center text-sm font-bold opacity-30">
                Sentence {currentIndex + 1} of {data.length}
            </div>
        </div>
    );
};

export default SentenceBuilder;
