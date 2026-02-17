import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSelector = () => {
    const { themes, currentTheme, setCurrentTheme, applyTheme } = useContext(ThemeContext);

    const handleMouseLeave = () => {
        applyTheme(currentTheme);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {themes.map((theme) => (
                <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-xl shadow-md overflow-hidden cursor-pointer border-2 ${
                        currentTheme.id === theme.id ? 'border-primary' : 'border-transparent'
                    }`}
                    onMouseEnter={() => applyTheme(theme)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setCurrentTheme(theme)}
                >
                    <div className="p-3 bg-surface flex flex-col items-center transition-colors duration-300">
                        <div className="flex space-x-1 mb-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                            <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: theme.colors.background }}></div>
                        </div>
                        <span className="text-xs font-bold text-text">{theme.name}</span>
                    </div>
                    {currentTheme.id === theme.id && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default ThemeSelector;
