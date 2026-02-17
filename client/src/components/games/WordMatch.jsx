import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WordMatch = ({ data, onComplete }) => {
    const [leftItems, setLeftItems] = useState([]);
    const [rightItems, setRightItems] = useState([]);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [matched, setMatched] = useState([]);
    const [wrong, setWrong] = useState(null);

    useEffect(() => {
        // Shuffle items
        const left = data.map((item, id) => ({ ...item, id: `L-${id}` })).sort(() => Math.random() - 0.5);
        const right = data.map((item, id) => ({ ...item, id: `R-${id}` })).sort(() => Math.random() - 0.5);
        setLeftItems(left);
        setRightItems(right);
    }, [data]);

    useEffect(() => {
        if (selectedLeft && selectedRight) {
            if (selectedLeft.translation === selectedRight.translation) {
                const newMatched = [...matched, selectedLeft.id, selectedRight.id];
                setMatched(newMatched);
                setSelectedLeft(null);
                setSelectedRight(null);
                
                if (newMatched.length === data.length * 2) {
                    setTimeout(() => onComplete(100), 1000);
                }
            } else {
                setWrong({ left: selectedLeft.id, right: selectedRight.id });
                setTimeout(() => {
                    setWrong(null);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                }, 800);
            }
        }
    }, [selectedLeft, selectedRight, matched, data.length, onComplete]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-text mb-2">Word Match</h2>
                <p className="text-text opacity-60">Connect the pairs correctly</p>
            </div>

            <div className="grid grid-cols-2 gap-12">
                {/* Left Side: Native Words */}
                <div className="space-y-4">
                    {leftItems.map((item) => {
                        const isMatched = matched.includes(item.id);
                        const isSelected = selectedLeft?.id === item.id;
                        const isWrong = wrong?.left === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                disabled={isMatched}
                                onClick={() => setSelectedLeft(item)}
                                className={`w-full p-6 h-24 rounded-2xl border-2 text-xl font-bold transition-all
                                    ${isMatched ? 'bg-green-100 border-green-500 text-green-700 opacity-50' : 
                                      isWrong ? 'bg-red-100 border-red-500 scale-95 shadow-lg' :
                                      isSelected ? 'bg-primary/20 border-primary scale-105 shadow-xl' : 
                                      'bg-surface border-text/5 hover:border-primary/50'}`}
                            >
                                {item.word}
                                {item.transliteration && (
                                    <span className="block text-xs font-medium opacity-40 mt-1 uppercase tracking-widest">{item.transliteration}</span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right Side: Translations */}
                <div className="space-y-4">
                    {rightItems.map((item) => {
                        const isMatched = matched.includes(item.id);
                        const isSelected = selectedRight?.id === item.id;
                        const isWrong = wrong?.right === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                disabled={isMatched}
                                onClick={() => setSelectedRight(item)}
                                className={`w-full p-6 h-24 rounded-2xl border-2 text-xl font-bold transition-all
                                    ${isMatched ? 'bg-green-100 border-green-500 text-green-700 opacity-50' : 
                                      isWrong ? 'bg-red-100 border-red-500 scale-95 shadow-xl' :
                                      isSelected ? 'bg-primary/20 border-primary scale-105 shadow-xl' : 
                                      'bg-surface border-text/5 hover:border-primary/50'}`}
                            >
                                {item.translation}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center text-sm font-bold opacity-50">
                <span>Progress: {Math.round((matched.length / (data.length * 2)) * 100)}%</span>
                <span>Matched: {matched.length / 2} / {data.length}</span>
            </div>
        </div>
    );
};

export default WordMatch;
